'use client'

import { Children, type ReactNode } from 'react'
import { LuChevronRight } from 'react-icons/lu'

import { CALLOUT, CALLOUT_BOX } from '@/components/markdown/callout'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

/**
 * A question that came up while studying, placed inline next to the section it's about.
 * Collapsed by default so it doesn't interrupt the main thread; native <details> keeps the
 * answer in the DOM while closed, so highlights and in-page search inside it still work.
 * Self-closing (no answer) means it's still open — the next /study run answers it in place.
 */
export function MyQuestion({ children, q }: { children?: ReactNode; q: string }) {
  const { m } = useI18n()
  const style = CALLOUT.question
  const Icon = style.icon
  const answered = Children.toArray(children).some(
    (child) => typeof child !== 'string' || child.trim() !== ''
  )

  return (
    <details className={cn(CALLOUT_BOX, 'group', style.box)}>
      <summary className="flex cursor-pointer list-none items-start gap-2 py-3 [&::-webkit-details-marker]:hidden">
        <LuChevronRight
          className={cn(
            'mt-0.5 size-4 shrink-0 transition-transform duration-200 group-open:rotate-90',
            style.accent
          )}
        />
        <span className="min-w-0">
          <span className={cn('flex items-center gap-1.5 text-xs font-medium', style.accent)}>
            <Icon className="size-3.5 shrink-0" />
            {m.docs.myQuestion}
          </span>
          <span className={cn('mt-1 block font-semibold', style.title)}>{q}</span>
        </span>
      </summary>
      <div className={cn('border-t pb-1', style.divider)}>
        {answered ? children : <p className="text-muted-foreground">{m.docs.questionPending}</p>}
      </div>
    </details>
  )
}
