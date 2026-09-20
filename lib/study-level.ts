import { promises as fs } from 'node:fs'
import path from 'node:path'

export type StudySourceCache = Map<string, Promise<string | null>>

function sourceForPage(pagePath: string, sourceByPage: StudySourceCache): Promise<string | null> {
  let source = sourceByPage.get(pagePath)
  if (!source) {
    const file = path.join(process.cwd(), 'contents', pagePath.slice(1), 'index.mdx')
    source = fs.readFile(file, 'utf-8').catch(() => null)
    sourceByPage.set(pagePath, source)
  }
  return source
}

/** The highest numbered Level in the bilingual MDX source. */
export function getLastStudyLevel(source: string): number | null {
  const levels = [...source.matchAll(/^#{2,3}\s+Level\s+(\d+)\b/gm)].map((match) =>
    Number(match[1])
  )
  return levels.length > 0 ? Math.max(...levels) : null
}

/**
 * Annotations are anchored by text rather than DOM offsets. Resolve their quote in the source,
 * then use the preceding Level heading. Both language versions use the same Level numbers.
 */
export async function getAnnotationStudyLevel(
  pagePath: string,
  exactQuote: string,
  sourceByPage: StudySourceCache
): Promise<number | null> {
  if (!pagePath.startsWith('/docs/') || !exactQuote) return null

  const source = await sourceForPage(pagePath, sourceByPage)
  if (!source) return null

  const quoteIndex = source.indexOf(exactQuote)
  if (quoteIndex < 0) return null

  const headings = [...source.slice(0, quoteIndex).matchAll(/^#{2,3}\s+Level\s+(\d+)\b/gm)]
  const level = headings.at(-1)?.[1]
  return level === undefined ? null : Number(level)
}

export function getStudyPageSource(
  pagePath: string,
  sourceByPage: StudySourceCache
): Promise<string | null> {
  return sourceForPage(pagePath, sourceByPage)
}
