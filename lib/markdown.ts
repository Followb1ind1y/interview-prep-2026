import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import { compileMDX } from 'next-mdx-remote/rsc'
import { type Element, type Text } from 'hast'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkCjkFriendly from 'remark-cjk-friendly/parseOnly'
import remarkGfm from 'remark-gfm'
import { type Node } from 'unist'
import { visit } from 'unist-util-visit'

import { type CollectionId } from '@/lib/collections'
import { components } from '@/lib/components'
import { isLocale, type Locale } from '@/lib/i18n/types'
import { GitHubLink } from '@/settings/navigation'
import { Settings } from '@/types/settings'

declare module 'hast' {
  interface Element {
    raw?: string
  }
}

export interface MdxHeaders {
  date?: string
  description: string
  descriptionEn?: string
  keywords: string
  title: string
  titleEn?: string
}

async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preCopy,
          rehypeCodeTitles,
          rehypeKatex,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postCopy,
        ],
        remarkPlugins: [remarkGfm, remarkCjkFriendly],
      },
    },
    components,
  })
}

function documentPath(collection: CollectionId, slug: string) {
  return Settings.gitload
    ? `${GitHubLink.href}/raw/main/contents/${collection}/${slug}/index.mdx`
    : path.join(process.cwd(), 'contents', collection, `${slug}/index.mdx`)
}

export const getDocument = cache(async (collection: CollectionId, slug: string) => {
  try {
    const contentPath = documentPath(collection, slug)

    let raw = ''
    let lastUpdated: string | null = null

    if (Settings.gitload) {
      const response = await fetch(contentPath)
      if (!response.ok) throw new Error('Failed to fetch content')
      raw = await response.text()
      lastUpdated = response.headers.get('Last-Modified') ?? null
    } else {
      raw = await fs.readFile(contentPath, 'utf-8')
      const stats = await fs.stat(contentPath)
      lastUpdated = stats.mtime.toISOString()
    }

    const parsedMdx = await parseMdx<MdxHeaders>(raw)
    const tocs = await getTable(collection, slug)

    return {
      frontmatter: parsedMdx.frontmatter,
      content: parsedMdx.content,
      tocs,
      lastUpdated,
    }
  } catch (err) {
    console.error(err)
    return null
  }
})

const headingRegex = /^(#{2,4})\s(.+)$/
const localeOpenRegex = /^<Locale\s+lang=["']([a-z]+)["']\s*>/
const fenceRegex = /^(```|~~~)/

type TableEntry = { href: string; lang?: Locale; level: number; text: string }

export async function getTable(collection: CollectionId, slug: string): Promise<TableEntry[]> {
  const extractedHeadings: TableEntry[] = []
  let raw = ''

  if (Settings.gitload) {
    const contentPath = `${GitHubLink.href}/raw/main/contents/${collection}/${slug}/index.mdx`
    try {
      const response = await fetch(contentPath)
      if (!response.ok) return []
      raw = await response.text()
    } catch {
      return []
    }
  } else {
    const contentPath = path.join(process.cwd(), 'contents', collection, `${slug}/index.mdx`)
    try {
      const stream = createReadStream(contentPath, { encoding: 'utf-8' })
      for await (const chunk of stream) {
        raw += chunk
      }
    } catch {
      return []
    }
  }

  // Tag headings inside <Locale lang="…"> blocks so the TOC only lists the active language.
  let lang: Locale | undefined
  let inFence = false

  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (fenceRegex.test(trimmed)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const open = localeOpenRegex.exec(trimmed)
    if (open) {
      lang = isLocale(open[1]) ? open[1] : undefined
      continue
    }
    if (trimmed.startsWith('</Locale>')) {
      lang = undefined
      continue
    }

    const heading = headingRegex.exec(line)
    if (heading) {
      const text = heading[2].trim()
      extractedHeadings.push({
        level: heading[1].length,
        text,
        href: `#${innerSlug(text)}`,
        ...(lang && { lang }),
      })
    }
  }

  return extractedHeadings
}

function innerSlug(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_]/g, '')
}

const preCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre') {
      const [codeEl] = node.children as Element[]
      if (codeEl?.tagName === 'code') {
        const textNode = codeEl.children?.[0] as Text
        node.raw = textNode?.value || ''
      }
    }
  })
}

const postCopy = () => (tree: Node) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'pre' && node.raw) {
      node.properties = node.properties || {}
      node.properties.raw = node.raw
    }
  })
}
