import { type MetadataRoute } from 'next/types'

import { Settings } from '@/types/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${Settings.metadataBase}/sitemap.xml`,
  }
}
