import { cache } from 'react'

import { readAnnotationPages } from '@/lib/annotate/file'
import { type Annotation } from '@/lib/annotate/types'
import { type CollectionId } from '@/lib/collections'
import { getCollectionPageRoutes } from '@/lib/pageroutes'
import {
  getAnnotationStudyLevel,
  getLastStudyLevel,
  getStudyPageSource,
  type StudySourceCache,
} from '@/lib/study-level'
import {
  type StudyLevelProgress,
  type StudyProgress,
} from '@/lib/study-status'

export type { StudyLevelProgress, StudyProgress } from '@/lib/study-status'

/** A saved translation has an empty note; looking up one word is not a learning-progress signal. */
function isLearningRecord(annotation: Annotation): boolean {
  return annotation.kind === 'highlight' || Boolean(annotation.note?.trim())
}

/** Returns the Levels that have a real learning record in either language. */
export async function getStudyLevelProgress(
  pagePath: string,
  annotations: Annotation[]
): Promise<StudyLevelProgress> {
  const records = annotations.filter(isLearningRecord)
  if (records.length === 0) return {}

  const sourceByPage: StudySourceCache = new Map()
  const levels = await Promise.all(
    records.map((record) => getAnnotationStudyLevel(pagePath, record.quote.exact, sourceByPage))
  )

  return Object.fromEntries(
    levels
      .filter((level): level is number => level !== null)
      .map((level) => [level, 'done'] as const)
  )
}

/**
 * Learning state comes from saved work, not a second manual checklist:
 * - no highlight/note: todo
 * - any record before the last Level: doing
 * - a record in the last Level in either language: done
 */
export const getStudyProgress = cache(async (collection: CollectionId): Promise<StudyProgress> => {
  if (collection !== 'docs') return {}

  const pages = getCollectionPageRoutes(collection)
  const annotationsByPage = await readAnnotationPages()
  const sourceByPage: StudySourceCache = new Map()
  const entries = await Promise.all(
    pages.map(async ({ href }) => {
      const pagePath = `/${collection}${href}`
      const records = (annotationsByPage[pagePath] ?? []).filter(isLearningRecord)
      if (records.length === 0) return null

      const source = await getStudyPageSource(pagePath, sourceByPage)
      const lastLevel = source ? getLastStudyLevel(source) : null
      // Only course-style knowledge pages participate in sidebar progress.
      if (lastLevel === null) return null

      const levels = await Promise.all(
        records.map((record) => getAnnotationStudyLevel(pagePath, record.quote.exact, sourceByPage))
      )
      if (levels.some((level) => level === lastLevel)) return [pagePath, 'done'] as const

      return [pagePath, 'doing'] as const
    })
  )

  return Object.fromEntries(
    entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  )
})
