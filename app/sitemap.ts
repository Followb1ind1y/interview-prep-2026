import { type MetadataRoute } from 'next/types'

import { AllPageRoutes } from '@/lib/pageroutes'
import { Settings } from '@/types/settings'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: Settings.metadataBase,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...AllPageRoutes.map((page) => ({
      url: `${Settings.metadataBase}${page.href}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
