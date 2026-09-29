'use client'

import { type PropsWithChildren } from 'react'

import { useI18n } from '@/lib/i18n/provider'
import { type Locale as LocaleCode } from '@/lib/i18n/types'

interface LocaleProps extends PropsWithChildren {
  lang: LocaleCode
}

/**
 * Renders children only when the active locale matches `lang`.
 * The `display: contents` wrapper keeps layout unchanged while letting
 * `lib/i18n/scroll-anchor` pair the n-th zh block with the n-th en block.
 */
export function Locale({ lang, children }: LocaleProps) {
  const { locale } = useI18n()
  if (locale !== lang) return null
  return (
    <div className="contents" data-locale-block={lang}>
      {children}
    </div>
  )
}
