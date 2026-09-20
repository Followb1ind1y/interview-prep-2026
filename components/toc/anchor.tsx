'use client'

import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { LuChevronRight } from 'react-icons/lu'

import { StudyStatusIcon } from '@/components/study-status'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useI18n } from '@/lib/i18n/provider'
import { type I18nText, type Locale, localize } from '@/lib/i18n/types'
import { type StudyLevelProgress } from '@/lib/study-progress'
import { cn } from '@/lib/utils'

export interface TocItem {
  href: string
  lang?: Locale
  level: number
  text: I18nText | string
}

export interface TableAnchorProps {
  levelProgress?: StudyLevelProgress
  tocs: TocItem[]
}

/** A heading becomes current once its top scrolls above this line (px from viewport top). */
const ACTIVE_OFFSET = 120

function toId(href: string) {
  return href.startsWith('#') ? href.slice(1) : href
}

function levelFromHeading(text: I18nText | string, locale: Locale): number | null {
  const label = localize(text, locale)
  const match = /^Level\s+(\d+)\b/.exec(label)
  return match ? Number(match[1]) : null
}

interface TocSection {
  children: TocItem[]
  parent: TocItem
}

export function TableAnchor({ levelProgress = {}, tocs }: TableAnchorProps) {
  const { locale, m } = useI18n()
  const localized = useMemo(
    () => tocs.filter((item) => !item.lang || item.lang === locale),
    [tocs, locale]
  )
  const [visible, setVisible] = useState(localized)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  // Holds the clicked entry while its smooth scroll is in flight, so the spy can't override it.
  const lockRef = useRef(false)

  useEffect(() => {
    setVisible(localized.filter(({ href }) => document.getElementById(toId(href)) != null))
  }, [localized])

  // Scroll spy: the last heading above ACTIVE_OFFSET is current; the last one wins at page bottom.
  useEffect(() => {
    const headings = visible
      .map(({ href }) => document.getElementById(toId(href)))
      .filter((el): el is HTMLElement => el != null)
    if (!headings.length) return

    let frame = 0
    const update = () => {
      frame = 0
      if (lockRef.current) return
      const { scrollY, innerHeight } = window
      const atBottom =
        scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2
      let current: string | null = null
      if (atBottom) {
        current = headings[headings.length - 1].id
      } else {
        for (const el of headings) {
          if (el.getBoundingClientRect().top > ACTIVE_OFFSET) break
          current = el.id
        }
      }
      setActiveId(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [visible])

  // Keep the current entry inside the TOC's own scroll viewport.
  useEffect(() => {
    if (!activeId) return
    const link = activeRef.current
    const viewport = link?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (!link || !viewport) return

    const linkRect = link.getBoundingClientRect()
    const viewRect = viewport.getBoundingClientRect()
    if (linkRect.top < viewRect.top) {
      viewport.scrollTop -= viewRect.top - linkRect.top + 24
    } else if (linkRect.bottom > viewRect.bottom) {
      viewport.scrollTop += linkRect.bottom - viewRect.bottom + 24
    }
  }, [activeId])

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = toId(href)
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
      setActiveId(id)
      lockRef.current = true
      const release = () => {
        lockRef.current = false
      }
      window.addEventListener('scrollend', release, { once: true })
      window.setTimeout(release, 1500) // fallback: no scrollend support, or nothing to scroll
    }
  }

  if (!visible.length) return null

  const minLevel = Math.min(...visible.map(({ level }) => level))
  const sections = visible.reduce<TocSection[]>((result, item) => {
    if (item.level === minLevel || result.length === 0) {
      result.push({ children: [], parent: item })
    } else {
      result.at(-1)?.children.push(item)
    }
    return result
  }, [])

  const renderLink = (item: TocItem, depth: number) => {
    const id = toId(item.href)
    const label = localize(item.text, locale)
    const isActive = id === activeId

    return (
      <Link
        aria-current={isActive ? 'location' : undefined}
        className={cn(
          '-ml-px block border-l-2 border-transparent py-1 pr-2 transition-colors hover:text-foreground',
          depth === 0 && 'pl-3 font-medium text-foreground/80',
          depth === 1 && 'pl-6 text-muted-foreground',
          depth >= 2 && 'pl-9 text-muted-foreground',
          isActive && 'border-primary text-foreground'
        )}
        href={item.href}
        onClick={(e) => handleSmoothScroll(e, item.href)}
        ref={isActive ? activeRef : undefined}
        scroll={false}
        title={label}
      >
        <span className="line-clamp-2 wrap-break-word">{label}</span>
      </Link>
    )
  }

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <h3 className="pl-3 text-sm font-semibold">{m.docs.onThisPage}</h3>
      <ScrollArea className="min-h-0 overflow-hidden">
        <ul className="border-l border-border pb-4 text-[13px] leading-snug">
          {sections.map(({ parent, children }, index) => {
            const studyLevel = levelFromHeading(parent.text, locale)
            const status = studyLevel === null ? undefined : levelProgress[studyLevel]
            const parentLink = renderLink(parent, 0)

            if (children.length === 0) {
              return (
                <li className={cn(index > 0 && 'mt-2.5')} key={parent.href}>
                  {parentLink}
                </li>
              )
            }

            return (
              <li className={cn(index > 0 && 'mt-2.5')} key={parent.href}>
                <Collapsible defaultOpen={status !== 'done'}>
                  <div className="flex items-start">
                    <div className="min-w-0 flex-1">{parentLink}</div>
                    {status && <StudyStatusIcon className="mt-1.5" status={status} />}
                    <CollapsibleTrigger asChild>
                      <Button
                        aria-label="Toggle section"
                        className="group mt-0.5 mr-1 size-5 shrink-0"
                        size="icon"
                        variant="ghost"
                      >
                        <LuChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <ul>
                      {children.map((item) => (
                        <li key={item.href}>{renderLink(item, item.level - minLevel)}</li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
    </div>
  )
}
