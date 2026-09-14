import { execFileSync } from 'node:child_process'

export interface DayCount {
  count: number
  date: string
}

function git(args: string[], cwd: string, timeout?: number): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout,
  }).trim()
}

/**
 * Commits per day from git history, dated in each commit's own timezone.
 * Throws when git or the .git directory isn't available — callers decide the fallback.
 */
export function readGitActivity(cwd = process.cwd()): DayCount[] {
  const out = git(['log', '--date=format:%Y-%m-%d', '--pretty=format:%ad'], cwd)

  const counts = new Map<string, number>()
  for (const line of out.split('\n')) {
    const date = line.trim()
    if (!date) continue
    counts.set(date, (counts.get(date) ?? 0) + 1)
  }

  return [...counts.entries()].map(([date, count]) => ({ date, count }))
}

export function isShallowRepository(cwd = process.cwd()): boolean {
  return git(['rev-parse', '--is-shallow-repository'], cwd) === 'true'
}

/**
 * CI clones (Vercel's included) are shallow, so `git log` there only sees the latest few commits
 * and the heatmap ends up lighter than it is locally. Fetch the rest of the history first:
 * the configured remote, then the GitHub URL Vercel exposes through its system env vars.
 * Returns whether the full history is available afterwards.
 */
export function ensureFullHistory(cwd = process.cwd()): boolean {
  if (!isShallowRepository(cwd)) return true

  const { VERCEL_GIT_REPO_OWNER: owner, VERCEL_GIT_REPO_SLUG: slug } = process.env
  const sources = ['origin', ...(owner && slug ? [`https://github.com/${owner}/${slug}.git`] : [])]
  for (const source of sources) {
    try {
      git(['fetch', '--unshallow', '--quiet', source], cwd, 60_000)
      if (!isShallowRepository(cwd)) return true
    } catch {
      // Remote missing or unreachable: try the next source
    }
  }
  return false
}
