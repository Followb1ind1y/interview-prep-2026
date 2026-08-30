import { promises as fs } from 'node:fs'
import path from 'node:path'

import { buildSearchIndex } from '@/lib/search-index'

const outputDir = path.join(process.cwd(), 'public', 'search-data')

async function convertMdxToJson() {
  await fs.mkdir(outputDir, { recursive: true })
  const combinedData = await buildSearchIndex()
  await fs.writeFile(path.join(outputDir, 'documents.json'), JSON.stringify(combinedData, null, 2))
}

convertMdxToJson().catch((err) => {
  console.error('Error processing MDX files:', err)
  process.exit(1)
})
