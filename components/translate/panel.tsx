'use client'

import { useState } from 'react'
import { LuCheck, LuCopy, LuX } from 'react-icons/lu'

import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { type TranslateResponse } from '@/lib/translate/types'
import { cn } from '@/lib/utils'

function CopyButton({ value }: { value: string }) {
  const { m } = useI18n()
  const [copied, setCopied] = useState(false)

  return (
    <button
      aria-label={copied ? m.translate.copied : m.translate.copy}
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon-xs' }), 'text-muted-foreground')}
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1200)
        })
      }}
      title={copied ? m.translate.copied : m.translate.copy}
      type="button"
    >
      {copied ? <LuCheck /> : <LuCopy />}
    </button>
  )
}

export function TranslatePanel({
  data,
  onClose,
  source,
}: {
  data: TranslateResponse
  onClose: () => void
  source: string
}) {
  const { m } = useI18n()
  const { result, direction } = data

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="line-clamp-2 text-xs break-words text-muted-foreground">{source}</div>
          <div className="mt-0.5 text-[0.7rem] text-muted-foreground/70">
            {direction === 'zh2en' ? m.translate.toEn : m.translate.toZh}
            {result.pos ? ` · ${result.pos}` : ''}
          </div>
        </div>
        <button
          aria-label={m.translate.close}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
            'text-muted-foreground'
          )}
          onClick={onClose}
          type="button"
        >
          <LuX />
        </button>
      </div>

      <div className="flex items-start gap-1.5 border-t border-border pt-3">
        <p className="flex-1 text-sm leading-relaxed font-medium text-foreground">
          {result.primary}
        </p>
        <CopyButton value={result.primary} />
      </div>

      {result.note && (
        <p className="border-t border-border pt-2 text-xs leading-relaxed text-muted-foreground">
          {result.note}
        </p>
      )}
    </div>
  )
}
