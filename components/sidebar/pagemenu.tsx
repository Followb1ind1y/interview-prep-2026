'use client'

import { usePathname } from 'next/navigation'

import { SubLink } from '@/components/sidebar/sublink'
import { Separator } from '@/components/ui/separator'
import { isCollectionId } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import { getCollectionRoutes } from '@/lib/pageroutes'
import { type StudyProgress } from '@/lib/study-status'

export function PageMenu({
  isSheet = false,
  progress = {},
}: {
  isSheet?: boolean
  progress?: StudyProgress
}) {
  const path = usePathname()
  const { locale } = useI18n()
  const collection = path.split('/')[1]

  if (!isCollectionId(collection)) return null

  const routes = getCollectionRoutes(collection)

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {routes.map((item, index) => {
        if ('spacer' in item) {
          return <Separator className="my-2" key={`spacer-${index}`} />
        }

        return (
          <div key={`${item.href}-${index}`}>
            {item.heading && (
              <div className="mb-4 text-sm font-semibold">{localize(item.heading, locale)}</div>
            )}
            <SubLink
              {...{
                ...item,
                href: `/${collection}${item.href}`,
                level: 0,
                isSheet,
                progress,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
