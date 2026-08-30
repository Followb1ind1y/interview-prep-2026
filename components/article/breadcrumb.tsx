'use client'

import { Fragment } from 'react'
import { LuHouse } from 'react-icons/lu'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { type CollectionId } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { getCollectionPageRoutes } from '@/lib/pageroutes'
import { Link } from '@/lib/transition'
import { localize } from '@/lib/i18n/types'
import { toTitleCase } from '@/utils/toTitleCase'

interface BreadcrumbProps {
  collection: CollectionId
  paths: string[]
}

export function ArticleBreadcrumb({ paths, collection }: BreadcrumbProps) {
  const { locale, m } = useI18n()
  const first = getCollectionPageRoutes(collection)[0]?.href ?? ''
  const homeHref = `/${collection}${first}`

  const labelFor = (segment: string, index: number) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`
    const match = getCollectionPageRoutes(collection).find((page) => page.href === href)
    if (match) return localize(match.title, locale)
    return toTitleCase(segment)
  }

  return (
    <Breadcrumb className="pb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link aria-label={m.common.home} href={homeHref} title={m.common.home}>
              <LuHouse className="h-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {paths.length > 2 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${collection}/${paths[0]}`}>{labelFor(paths[0], 0)}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis className="h-1" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{labelFor(paths[paths.length - 1], paths.length - 1)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          paths.map((path, index) => {
            const href = `/${collection}/${paths.slice(0, index + 1).join('/')}`
            return (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index < paths.length - 1 ? (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{labelFor(path, index)}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{labelFor(path, index)}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            )
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
