import { promises as fs } from 'node:fs'
import path from 'node:path'
import grayMatter from 'gray-matter'

import timeline from '@/contents/site/timeline.json'
import { COLLECTION_IDS } from '@/lib/collections'

export interface ActivityDay {
  count: number
  date: string
}

async function walkMdx(dir: string): Promise<string[]> {
  const files: string[] = []
  let entries

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
 * Commits per day, pre-generated at build time by scripts/content.ts (git history
 * isn't available from the deployed serverless function at request time). Missing
 * on a fresh checkout before the first build, so a missing file is not an error.
 */
async function getDevActivityDays(): Promise<ActivityDay[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), 'public', 'search-data', 'dev-activity.json'),
      'utf-8'
    )
    return JSON.parse(raw) as ActivityDay[]
  } catch {
    return []
  }
}

export async function getActivityDays(): Promise<ActivityDay[]> {
  const counts = new Map<string, number>()

  const bump = (day: string | null, amount = 1) => {
    if (!day) return
    counts.set(day, (counts.get(day) ?? 0) + amount)
  }

  for (const id of COLLECTION_IDS) {
    const dir = path.join(process.cwd(), 'contents', id)
    const files = await walkMdx(dir)

    for (const file of files) {
      const raw = await fs.readFile(file, 'utf-8')
      const { data } = grayMatter(raw)
      bump(toDay(data.date))
    }
  }

  for (const item of timeline) {
    bump(toDay(item.date))
  }

  for (const day of await getDevActivityDays()) {
    bump(toDay(day.date), day.count)
  }

  return [...counts.entries()]
    .map(([date, count]) => ({ date, count }))
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
