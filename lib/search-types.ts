import { type CollectionId } from '@/lib/collections'

export interface SearchDocument {
  _searchMeta: {
    cleanContent: string
    headings: string[]
    keywords: string[]
  }
  collection: CollectionId
  content: string
  description: string
  slug: string
  title: string
  titleEn?: string
}
