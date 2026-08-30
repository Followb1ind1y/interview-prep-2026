'use client'

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { type CollectionId } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import { getPreviousNext } from '@/lib/pageroutes'
import { Link } from '@/lib/transition'

interface PaginationProps {
  collection: CollectionId
  pathname: string
}

export function Pagination({ pathname, collection }: PaginationProps) {
  const { locale } = useI18n()
  const res = getPreviousNext(collection, pathname)

  return (
    <div className="flex items-center justify-between py-5 sm:py-7">
      {res.prev && (
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium whitespace-nowrap no-underline! shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          href={`/${collection}${res.prev.href}`}
          rel="prev"
        >
          <LuChevronLeft className="mr-1 h-4 w-4" />
          <span>{localize(res.prev.title, locale)}</span>
        </Link>
      )}
      {res.next && (
        <Link
          className="ml-auto inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium whitespace-nowrap no-underline! shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          href={`/${collection}${res.next.href}`}
          rel="next"
        >
          <span>{localize(res.next.title, locale)}</span>
          <LuChevronRight className="ml-1 h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
