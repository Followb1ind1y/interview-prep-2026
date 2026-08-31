import { promises as fs } from 'node:fs'
import path from 'node:path'
import grayMatter from 'gray-matter'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { type Node, type Parent } from 'unist'
import { visit } from 'unist-util-visit'

import { COLLECTION_IDS, Collections, type CollectionId } from '@/lib/collections'
import { isRoute, type Paths } from '@/lib/paths'
import { type SearchDocument } from '@/lib/search-types'

interface MdxJsxFlowElement extends Node {
  children?: Node[]
  name: string
}

export type { SearchDocument }

function isMdxJsxFlowElement(node: Node): node is MdxJsxFlowElement {
  return node.type === 'mdxJsxFlowElement' && 'name' in node
}

function createSlug(collectionDir: string, filePath: string): string {
  const relativePath = path.relative(collectionDir, filePath)
  const parsed = path.parse(relativePath)
  const slugPath = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name
  const normalizedSlug = slugPath.replace(/\\/g, '/')

  if (parsed.name === 'index') {
    const dir = parsed.dir.replace(/\\/g, '/')
    return dir ? `/${dir}` : '/'
  }

  return `/${normalizedSlug}`
}

function findDocumentBySlug(routes: Paths[], slug: string): Paths | null {
  function searchDocs(docs: Paths[], currentPath = ''): Paths | null {
    for (const doc of docs) {
      if (isRoute(doc)) {
        const fullPath = currentPath + doc.href
        if (fullPath === slug) return doc
        if (doc.items) {
          const found = searchDocs(doc.items, fullPath)
          if (found) return found
        }
      }
    }
    return null
  }
  return searchDocs(routes)
}

function removeCustomComponents() {
  const customComponentNames = [
    'Tabs',
    'TabsList',
    'TabsTrigger',
    'pre',
    'Mermaid',
    'Card',
    'CardGrid',
    'Step',
    'StepItem',
    'Note',
    'FileTree',
    'Folder',
    'File',
    'ResumeAbout',
    'ResumeCV',
  ]

  return (tree: Node) => {
    visit(tree, 'mdxJsxFlowElement', (node: Node, index: number | null, parent: Parent | null) => {
      if (
        isMdxJsxFlowElement(node) &&
        parent &&
        Array.isArray(parent.children) &&
        customComponentNames.includes(node.name)
      ) {
        parent.children.splice(index!, 1)
      }
    })
  }
}

function cleanContentForSearch(content: string): string {
  let cleanedContent = content

  cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, ' ')
  cleanedContent = cleanedContent.replace(/`([^`]+)`/g, '$1')
  cleanedContent = cleanedContent.replace(/#{1,6}\s+(.+)/g, '$1')
  cleanedContent = cleanedContent.replace(/\*\*(.+?)\*\*/g, '$1').replace(/_(.+?)_/g, '$1')
  cleanedContent = cleanedContent.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  cleanedContent = cleanedContent.replace(/\|.*\|[\r\n]?/gm, (match) => {
    return match
      .split('|')
      .filter((cell) => cell.trim())
      .map((cell) => cell.trim())
      .join(' ')
  })
  cleanedContent = cleanedContent.replace(
    /<(?:Note|Card|Step|FileTree|Folder|File|Mermaid)[^>]*>([\s\S]*?)<\/(?:Note|Card|Step|FileTree|Folder|File|Mermaid)>/g,
    '$1'
  )
  cleanedContent = cleanedContent
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s*\[[x\s]\]\s+/gm, '')
    .replace(/^\s*>\s+/gm, '')
  cleanedContent = cleanedContent
    .replace(/[^\w\s\u4e00-\u9fff-:]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim()

  return cleanedContent
}

async function getMdxFiles(dir: string): Promise<string[]> {
  let files: string[] = []
  let items

  try {
    items = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files = files.concat(await getMdxFiles(fullPath))
    } else if (item.name.endsWith('.mdx')) {
      files.push(fullPath)
    }
  }

  return files
}

async function processMdxFile(collection: CollectionId, filePath: string): Promise<SearchDocument> {
  const rawMdx = await fs.readFile(filePath, 'utf-8')
  const { content, data: frontmatter } = grayMatter(rawMdx)
  const collectionDir = path.join(process.cwd(), 'contents', collection)

  const processed = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(removeCustomComponents)
    .use(remarkStringify)
    .process(content)

  const documentContent = String(processed.value)
  const headings =
    documentContent.match(/^##\s+(.+)$/gm)?.map((h) => h.replace(/^##\s+/, '').trim()) || []

  const extractedKeywords = new Set([
    ...(frontmatter.keywords || []),
    ...headings,
    ...(documentContent.match(/\*\*([^*]+)\*\*/g) || []).map((m) => m.replace(/\*\*/g, '').trim()),
    ...(documentContent.match(/`([^`]+)`/g) || []).map((m) => m.replace(/`/g, '').trim()),
  ])

  const slug = createSlug(collectionDir, filePath)
  const matchedDoc = findDocumentBySlug(Collections[collection].routes, slug)

  return {
    collection,
    slug: `/${collection}${slug}`,
    title:
      frontmatter.title ||
      (matchedDoc && isRoute(matchedDoc) ? matchedDoc.title.zh : 'Untitled'),
    titleEn: frontmatter.titleEn || (matchedDoc && isRoute(matchedDoc) ? matchedDoc.title.en : ''),
    description: frontmatter.description || '',
    content: documentContent,
    _searchMeta: {
      cleanContent: cleanContentForSearch(documentContent),
      headings,
      keywords: Array.from(extractedKeywords),
    },
  }
}

export async function buildSearchIndex(): Promise<SearchDocument[]> {
  const combined: SearchDocument[] = []

  for (const collection of COLLECTION_IDS) {
    const dir = path.join(process.cwd(), 'contents', collection)
    const files = await getMdxFiles(dir)
    for (const file of files) {
      combined.push(await processMdxFile(collection, file))
    }
  }

  return combined
}
