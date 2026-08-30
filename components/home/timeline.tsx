'use client'

import { useEffect, useRef } from 'react'

import { useI18n } from '@/lib/i18n/provider'
import { localize, type I18nText } from '@/lib/i18n/types'
import { formatIsoDate } from '@/lib/utils'

export interface TimelineItem {
  date: string
  description: I18nText
  title: I18nText
}

export function HomeTimeline({ items }: { items: TimelineItem[] }) {
  const { locale, m } = useI18n()
  const list = [...items].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <section className="mx-auto max-w-3xl py-20">
      <header className="mb-10">
        <p className="mb-2 text-xs tracking-[0.22em] text-muted-foreground uppercase">Log</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{m.home.timeline}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{m.home.timelineHint}</p>
      </header>

      <ol className="relative border-l border-border pl-6">
        {list.map((item, index) => (
          <TimelineRow index={index} item={item} key={`${item.date}-${index}`} locale={locale} />
        ))}
      </ol>
    </section>
  )
}

function TimelineRow({
  item,
  index,
  locale,
}: {
  index: number
  item: TimelineItem
  locale: 'zh' | 'en'
}) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('timeline-in')
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <li
      className="timeline-item relative mb-10 last:mb-0"
      ref={ref}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="absolute top-1.5 -left-[31px] size-3 rounded-full border-2 border-background bg-foreground" />
      <time className="text-xs tracking-wide text-muted-foreground">
        {formatIsoDate(item.date, locale)}
      </time>
      <h3 className="mt-1 text-base font-medium">{localize(item.title, locale)}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        {localize(item.description, locale)}
      </p>
    </li>
  )
}
