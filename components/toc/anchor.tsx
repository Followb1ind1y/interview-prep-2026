'use client'

import { type MouseEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useI18n } from '@/lib/i18n/provider'
import { localize, type I18nText } from '@/lib/i18n/types'

export interface TocItem {
  href: string
  level: number
  text: I18nText | string
}

export interface TableAnchorProps {
  tocs: TocItem[]
}

export function TableAnchor({ tocs }: TableAnchorProps) {
  const { locale, m } = useI18n()
  const [visible, setVisible] = useState(tocs)

  useEffect(() => {
    setVisible(
      tocs.filter(({ href }) => {
        const id = href.startsWith('#') ? href.slice(1) : href
        return document.getElementById(id) != null
      })
    )
  }, [tocs, locale])

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.startsWith('#') ? href.slice(1) : href
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  if (!visible.length) return null

  return (
    <div className="flex w-full flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">{m.docs.onThisPage}</h3>
      <ScrollArea className="pt-0.5 pb-4">
        <div className="flex flex-col gap-2.5 text-sm text-foreground">
          {visible.map(({ href, level, text }) => {
            const label = localize(text, locale)
            return (
              <Link
                aria-label={label}
                className={clsx('wrap-break-word', {
                  'pl-0': level === 2,
                  'pl-3': level === 3,
                  'pl-6': level === 4,
                })}
                href={href}
                key={href}
                onClick={(e) => handleSmoothScroll(e, href)}
                scroll={false}
                title={label}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
