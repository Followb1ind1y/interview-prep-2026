import { type Dirent, promises as fs } from 'node:fs'
import path from 'node:path'

import { readAnnotationPages } from '@/lib/annotate/file'
import { COLLECTION_IDS } from '@/lib/collections'
import { type DayCount, readGitActivity } from '@/lib/git-activity'
import { getAnnotationStudyLevel, type StudySourceCache } from '@/lib/study-level'
import devActivity from '@/public/search-data/dev-activity.json'

/** Counted per activity type so the heatmap can explain a day's shade. */
export interface ActivityBreakdown {
  commits: number
  studyLevels: number
}

export interface ActivityDay {
  breakdown: ActivityBreakdown
  count: number
  date: string
}

/**
 * Annotations only carry a timestamp, so turning them into a calendar day needs a timezone.
 * Use where the site owner lives, which also matches how git dates the commits.
 */
const TIME_ZONE = 'America/Toronto'
const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: TIME_ZONE,
  year: 'numeric',
})

async function walkMdx(dir: string): Promise<string[]> {
  const files: string[] = []
  let entries: Dirent[]

  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkMdx(fullPath)))
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }

  return files
}

function toDay(value: string | Date | undefined): string | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString().slice(0, 10)
}

/**
 * Commits per day. In development read git directly so today's commits show up right away;
 * the deployed serverless function has no .git directory, so production uses the snapshot
 * scripts/content.ts writes at build time. Imported rather than read with fs, so it is bundled
 * into the function instead of relying on public/ being traced alongside it.
 */
function getCommitDays(): DayCount[] {
  if (process.env.NODE_ENV === 'development') {
    try {
      return readGitActivity()
    } catch {
      // No git available: fall through to the build snapshot
    }
  }

  return devActivity
}

export async function getActivityDays(): Promise<ActivityDay[]> {
  const days = new Map<string, ActivityBreakdown>()

  const bump = (day: string | null, source: keyof ActivityBreakdown, amount = 1) => {
    if (!day) return
    const entry = days.get(day) ?? { commits: 0, studyLevels: 0 }
    entry[source] += amount
    days.set(day, entry)
  }

  for (const day of getCommitDays()) {
    bump(toDay(day.date), 'commits', day.count)
  }

  // Several highlights/notes in the same Level on one day are one study record.
  const studiedLevelsByDay = new Map<string, Set<string>>()
  const sourceByPage: StudySourceCache = new Map()
  for (const [pagePath, list] of Object.entries(await readAnnotationPages())) {
    for (const item of list) {
      const day = dayFormatter.format(item.createdAt)
      const level = await getAnnotationStudyLevel(pagePath, item.quote.exact, sourceByPage)
      if (level === null) continue
      const levels = studiedLevelsByDay.get(day) ?? new Set<string>()
      levels.add(`${pagePath}#level-${level}`)
      studiedLevelsByDay.set(day, levels)
    }
  }

  for (const [day, levels] of studiedLevelsByDay) {
    bump(day, 'studyLevels', levels.size)
  }

  return [...days.entries()]
    .map(([date, breakdown]) => ({
      breakdown,
      count: breakdown.studyLevels + breakdown.commits,
      date,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getContentCounts() {
  const counts = { docs: 0, companies: 0, resume: 0 }

  for (const id of COLLECTION_IDS) {
    const files = await walkMdx(path.join(process.cwd(), 'contents', id))
    counts[id] = files.length
  }

  return counts
}
