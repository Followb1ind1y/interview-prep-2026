import { type Dirent, promises as fs } from 'node:fs'
import path from 'node:path'
import grayMatter from 'gray-matter'

import timeline from '@/contents/site/timeline.json'
import { readAnnotationPages } from '@/lib/annotate/file'
import { COLLECTION_IDS } from '@/lib/collections'
import { type DayCount, readGitActivity } from '@/lib/git-activity'

/** Counted per source so the heatmap tooltip can show what a day was made of. */
export interface ActivityBreakdown {
  annotations: number
  commits: number
  milestones: number
  notes: number
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
 * the deployed serverless function has no .git directory, so production reads the snapshot
 * scripts/content.ts writes at build time (missing on a fresh checkout — not an error).
 */
async function getCommitDays(): Promise<DayCount[]> {
  if (process.env.NODE_ENV === 'development') {
    try {
      return readGitActivity()
    } catch {
      // No git available: fall through to the build snapshot
    }
  }

  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), 'public', 'search-data', 'dev-activity.json'),
      'utf-8'
    )
    return JSON.parse(raw) as DayCount[]
  } catch {
    return []
  }
}

export async function getActivityDays(): Promise<ActivityDay[]> {
  const days = new Map<string, ActivityBreakdown>()

  const bump = (day: string | null, source: keyof ActivityBreakdown, amount = 1) => {
    if (!day) return
    const entry = days.get(day) ?? { annotations: 0, commits: 0, milestones: 0, notes: 0 }
    entry[source] += amount
    days.set(day, entry)
  }

  for (const id of COLLECTION_IDS) {
    const files = await walkMdx(path.join(process.cwd(), 'contents', id))
    for (const file of files) {
      const { data } = grayMatter(await fs.readFile(file, 'utf-8'))
      bump(toDay(data.date), 'notes')
    }
  }

  for (const item of timeline) {
    bump(toDay(item.date), 'milestones')
  }

  for (const day of await getCommitDays()) {
    bump(toDay(day.date), 'commits', day.count)
  }

  // Highlights, notes, and saved translations are study work too — one each, on the day created
  for (const list of Object.values(await readAnnotationPages())) {
    for (const item of list) bump(dayFormatter.format(item.createdAt), 'annotations')
  }

  return [...days.entries()]
    .map(([date, breakdown]) => ({
      breakdown,
      count: breakdown.annotations + breakdown.commits + breakdown.milestones + breakdown.notes,
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
