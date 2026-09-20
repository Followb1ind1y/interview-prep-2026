'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LuChevronDown, LuChevronRight } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { StudyStatusIcon } from '@/components/study-status'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SheetClose } from '@/components/ui/sheet'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import { isRoute, type Paths, type StudyStatus } from '@/lib/paths'
import { type StudyProgress } from '@/lib/study-progress'
import { cn } from '@/lib/utils'

function sectionState(path: string, href?: string) {
  if (!href) return { inSection: false, onChild: false }
  const onChild = path.startsWith(`${href}/`)
  return { inSection: path === href || onChild, onChild }
}

function getRouteStatus(
  route: Extract<Paths, { href: string }>,
  progress: StudyProgress
): StudyStatus | undefined {
  if (!route.items) return progress[route.href]

  const descendantStatuses = route.items
    .filter(isRoute)
    .flatMap((item) => getRouteStatuses(item, route.href, progress))

  if (descendantStatuses.length === 0) return progress[route.href]
  if (descendantStatuses.every((status) => status === 'done')) return 'done'
  if (descendantStatuses.some((status) => status === 'doing' || status === 'done')) return 'doing'
  return progress[route.href]
}

function getRouteStatuses(
  route: Extract<Paths, { href: string }>,
  parentHref: string,
  progress: StudyProgress
): StudyStatus[] {
  const href = `${parentHref}${route.href}`
  if (!route.items) return progress[href] ? [progress[href]] : []

  return route.items.filter(isRoute).flatMap((item) => getRouteStatuses(item, href, progress))
}

export function SubLink(
  props: Paths & { isSheet: boolean; level: number; progress: StudyProgress }
) {
  const path = usePathname()
  const { locale } = useI18n()
  const itemHref = isRoute(props) ? props.href : undefined
  const { inSection, onChild } = sectionState(path, itemHref)
  const [isOpen, setIsOpen] = useState(onChild)

  useEffect(() => {
    if (onChild) setIsOpen(true)
    else if (!inSection) setIsOpen(false)
  }, [inSection, onChild])

  if (!isRoute(props)) return

  const { title, href, items, noLink, level, isSheet, progress } = props
  const label = localize(title, locale)
  const status = getRouteStatus(props, progress)

  const Comp = (
    <Anchor activeClassName="text-primary text-sm font-semibold" href={href}>
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{label}</span>
        {(status === 'doing' || status === 'done') && <StudyStatusIcon status={status} />}
      </span>
    </Anchor>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="font-semibold text-primary sm:text-sm">{label}</h2>
  )

  if (!items) {
    return <div className="flex flex-col text-sm">{titleOrLink}</div>
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible onOpenChange={setIsOpen} open={isOpen}>
        <div className="mr-3 flex items-center gap-2 text-sm">
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button className="ml-auto h-6 w-6" size="icon" variant="link">
              {!isOpen ? (
                <LuChevronRight className="h-[0.9rem] w-[0.9rem]" />
              ) : (
                <LuChevronDown className="h-[0.9rem] w-[0.9rem]" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              'mt-2.5 flex flex-col items-start gap-3 border-l pl-4 text-sm',
              level > 0 && 'ml-1 border-l pl-4'
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) return null

              const modifiedItems = {
                ...innerLink,
                href: `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
                progress,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
