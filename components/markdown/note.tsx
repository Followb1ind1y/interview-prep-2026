import { type PropsWithChildren } from 'react'

import { CALLOUT, CALLOUT_BOX, type CalloutKind } from '@/components/markdown/callout'
import { cn } from '@/lib/utils'

interface NoteProps extends PropsWithChildren {
  title?: string
  /** Pick by content, not by looks — see the color rule in components/markdown/callout.ts. */
  type?: Exclude<CalloutKind, 'question'>
}

export function Note({ children, title = 'Note', type = 'note' }: NoteProps) {
  const style = CALLOUT[type]
  const Icon = style.icon

  return (
    <div className={cn(CALLOUT_BOX, 'py-0.5', style.box)}>
      <p className={cn('-mb-3 flex items-center gap-1.5 text-sm font-semibold', style.title)}>
        <Icon className={cn('size-4 shrink-0', style.accent)} />
        {title}:
      </p>
      {children}
    </div>
  )
}
