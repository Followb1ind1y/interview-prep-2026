import { type SearchDocument } from '@/lib/search-types'

export interface SearchHit {
  description?: string
  href: string
  relevance: number
  snippet?: string
  title: string
  titleEn?: string
}

function hasCjk(text: string) {
  return /[\u4e00-\u9fff]/.test(text)
}

function tokenize(query: string) {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []
  if (hasCjk(trimmed)) {
    return trimmed.split(/\s+/).filter((word) => word.length >= 1)
  }
  return trimmed.split(/\s+/).filter((word) => word.length >= 2)
}

function relevance(
  query: string,
  title: string,
  content: string,
  headings: string[],
  keywords: string[]
) {
  const lowerQuery = query.toLowerCase().trim()
  const lowerTitle = title.toLowerCase()
  const queryWords = tokenize(query)
  let score = 0

  if (lowerTitle === lowerQuery) score += 50
  else if (lowerTitle.includes(lowerQuery)) score += 30

  queryWords.forEach((word) => {
    if (lowerTitle.includes(word)) score += 15
  })

  const lowerHeadings = headings.map((h) => h.toLowerCase())
  if (lowerHeadings.some((h) => h === lowerQuery)) score += 40
  lowerHeadings.forEach((heading) => {
    if (heading.includes(lowerQuery)) score += 25
  })

  const lowerKeywords = keywords.map((k) => k.toLowerCase())
  if (lowerKeywords.some((k) => k === lowerQuery)) score += 35
  lowerKeywords.forEach((keyword) => {
    if (keyword.includes(lowerQuery)) score += 20
  })

  queryWords.forEach((word) => {
    const matches = content.toLowerCase().split(word).length - 1
    if (matches > 0) score += matches * 8
  })

  return score / Math.log(content.length + 2)
}

function extractSnippet(content: string, query: string) {
  const words = tokenize(query)
  const indices: number[] = []

  words.forEach((word) => {
    const index = content.toLowerCase().indexOf(word)
    if (index !== -1) indices.push(index)
  })

  if (indices.length === 0) return content.slice(0, 100)

  const avgIndex = Math.floor(indices.reduce((a, b) => a + b) / indices.length)
  const start = Math.max(0, avgIndex - 80)
  const end = Math.min(avgIndex + 80, content.length)
  let snippet = content.slice(start, end)
  if (start > 0) snippet = `...${snippet}`
  if (end < content.length) snippet += '...'
  return snippet
}

export function searchDocuments(query: string, documents: SearchDocument[]): SearchHit[] {
  const queryWords = tokenize(query)
  if (queryWords.length === 0) return []

  return documents
    .map((doc) => {
      const titleBlob = `${doc.title} ${doc.titleEn ?? ''}`
      const score = relevance(
        query,
        titleBlob,
        doc._searchMeta.cleanContent,
        doc._searchMeta.headings,
        doc._searchMeta.keywords
      )

      return {
        title: doc.title,
        titleEn: doc.titleEn,
        href: doc.slug,
        snippet: extractSnippet(doc._searchMeta.cleanContent, query),
        description: doc.description || '',
        relevance: score,
      }
    })
    .filter((doc) => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10)
}

export function isSearchReady(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return false
  if (hasCjk(trimmed)) return trimmed.length >= 1
  return trimmed.length >= 2
}
