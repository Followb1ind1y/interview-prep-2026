import { Companies } from '@/settings/companies'
import { Documents } from '@/settings/documents'
import { Resume } from '@/settings/resume'
import { type I18nText } from '@/lib/i18n/types'
import { type Paths } from '@/lib/paths'

export const COLLECTION_IDS = ['docs', 'companies', 'resume'] as const

export type CollectionId = (typeof COLLECTION_IDS)[number]

export interface CollectionConfig {
  contentDir: string
  heading: I18nText
  id: CollectionId
  routes: Paths[]
}

export const Collections: Record<CollectionId, CollectionConfig> = {
  docs: {
    id: 'docs',
    contentDir: 'contents/docs',
    heading: { zh: '面试笔记', en: 'Interview Notes' },
    routes: Documents,
  },
  companies: {
    id: 'companies',
    contentDir: 'contents/companies',
    heading: { zh: '投递记录', en: 'Applications' },
    routes: Companies,
  },
  resume: {
    id: 'resume',
    contentDir: 'contents/resume',
    heading: { zh: '简历与介绍', en: 'Resume' },
    routes: Resume,
  },
}

export function isCollectionId(value: string | undefined): value is CollectionId {
  return COLLECTION_IDS.includes(value as CollectionId)
}
