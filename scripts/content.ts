import { promises as fs } from 'node:fs'
import path from 'node:path'

import { type DayCount, ensureFullHistory, readGitActivity } from '@/lib/git-activity'
import { buildSearchIndex } from '@/lib/search-index'

const outputDir = path.join(process.cwd(), 'public', 'search-data')

/**
 * Commits per day, so the homepage heatmap also reflects site-building work —
 * not just dated notes. Runs at build time because the deployed serverless
 * function has no .git directory to read from at request time.
 *
 * Returns null when the full history can't be read (a shallow CI clone that can't be
 * deepened, or no git at all). The caller then keeps the committed snapshot, which was
 * generated from the full local history, instead of overwriting it with a truncated count.
 */
function getDevActivity(): DayCount[] | null {
  try {
    if (!ensureFullHistory()) {
      console.warn(
        'Git history is shallow and could not be deepened; keeping the committed dev-activity.json'
      )
      return null
    }
    return readGitActivity()
  } catch (err) {
    console.warn('Could not read git history; keeping the committed dev-activity.json:', err)
    return null
  }
}

async function convertMdxToJson() {
  await fs.mkdir(outputDir, { recursive: true })
  const combinedData = await buildSearchIndex()
  await fs.writeFile(path.join(outputDir, 'documents.json'), JSON.stringify(combinedData, null, 2))

  const activity = getDevActivity()
  if (activity) {
    await fs.writeFile(path.join(outputDir, 'dev-activity.json'), JSON.stringify(activity, null, 2))
  }
}

convertMdxToJson().catch((err) => {
  console.error('Error processing MDX files:', err)
  process.exit(1)
})
