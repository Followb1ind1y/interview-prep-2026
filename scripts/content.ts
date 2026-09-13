import { promises as fs } from 'node:fs'
import path from 'node:path'

import { type DayCount, readGitActivity } from '@/lib/git-activity'
import { buildSearchIndex } from '@/lib/search-index'

const outputDir = path.join(process.cwd(), 'public', 'search-data')

/**
 * Commits per day, so the homepage heatmap also reflects site-building work —
 * not just dated notes. Runs at build time because the deployed serverless
 * function has no .git directory to read from at request time.
 */
function getDevActivity(): DayCount[] {
  try {
    return readGitActivity()
  } catch (err) {
    console.warn('Could not read git history for dev activity:', err)
    return []
  }
}

async function convertMdxToJson() {
  await fs.mkdir(outputDir, { recursive: true })
  const combinedData = await buildSearchIndex()
  await fs.writeFile(path.join(outputDir, 'documents.json'), JSON.stringify(combinedData, null, 2))
  await fs.writeFile(
    path.join(outputDir, 'dev-activity.json'),
    JSON.stringify(getDevActivity(), null, 2)
  )
}

convertMdxToJson().catch((err) => {
  console.error('Error processing MDX files:', err)
  process.exit(1)
})
