import { execFileSync } from 'node:child_process'

export interface DayCount {
  count: number
  date: string
}

/**
 * Commits per day from git history, dated in each commit's own timezone.
 * Throws when git or the .git directory isn't available — callers decide the fallback.
 */
export function readGitActivity(cwd = process.cwd()): DayCount[] {
  const out = execFileSync('git', ['log', '--date=format:%Y-%m-%d', '--pretty=format:%ad'], {
    cwd,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })

  const counts = new Map<string, number>()
  for (const line of out.split('\n')) {
    const date = line.trim()
    if (!date) continue
    counts.set(date, (counts.get(date) ?? 0) + 1)
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count }))
}
