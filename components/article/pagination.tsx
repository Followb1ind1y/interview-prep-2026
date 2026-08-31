'use client'

import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import { buttonVariants } from '@/components/ui/button'
import { type CollectionId } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import { getPreviousNext } from '@/lib/pageroutes'
import { Link } from '@/lib/transition'
import { cn } from '@/lib/utils'

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
          className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'no-underline!')}
          href={`/${collection}${res.prev.href}`}
          rel="prev"
        >
          <LuChevronLeft className="h-4 w-4" />
          <span>{localize(res.prev.title, locale)}</span>
        </Link>
      )}
      {res.next && (
        <Link
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'ml-auto no-underline!'
          )}
          href={`/${collection}${res.next.href}`}
          rel="next"
        >
          <span>{localize(res.next.title, locale)}</span>
          <LuChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
