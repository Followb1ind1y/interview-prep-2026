'use client'

import { LuCheck } from 'react-icons/lu'

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

  return (
    <span
      aria-label={label}
      className={cn(
        'relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2 bg-background',
        status === 'done' ? 'border-success text-success' : 'border-info text-info',
        className
      )}
      role="img"
      title={label}
    >
      {status === 'done' ? (
        <LuCheck className="size-2.5 stroke-[3]" />
      ) : (
        <span aria-hidden className="absolute inset-0 m-auto size-1.5 rounded-full bg-current" />
      )}
    </span>
  )
}
