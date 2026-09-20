'use client'

import { useI18n } from '@/lib/i18n/provider'
import { type StudyStatus } from '@/lib/paths'
import { cn } from '@/lib/utils'

export function StudyStatusIcon({
  className,
  status,
}: {
  className?: string
  status: StudyStatus
}) {
  const { m } = useI18n()
  const label = status === 'done' ? m.docs.statusDone : m.docs.statusDoing
  const done = status === 'done'

  return (
    <span
      aria-label={label}
      className={cn(
        'inline-grid size-3.5 shrink-0 place-items-center rounded-full',
        done
          ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400'
          : 'bg-amber-100 text-amber-500 dark:bg-amber-950/45 dark:text-amber-400',
        className
      )}
      role="img"
      title={label}
    >
      {done ? (
        <svg aria-hidden className="size-2.5" fill="none" viewBox="0 0 10 10">
          <path
            d="M2 5.15 4.15 7.25 8 2.75"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.65"
          />
        </svg>
      ) : (
        <svg aria-hidden className="size-2.5" fill="none" viewBox="0 0 10 10">
          <circle
            className="opacity-30"
            cx="5"
            cy="5"
            r="3.35"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 1.65a3.35 3.35 0 0 1 3.35 3.35"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </span>
  )
}
