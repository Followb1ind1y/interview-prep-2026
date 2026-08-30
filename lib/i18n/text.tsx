'use client'

import { localize, type I18nText } from '@/lib/i18n/types'
import { useI18n } from '@/lib/i18n/provider'

export function T({
  text,
  as: Comp = 'span',
  className,
}: {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div'
  className?: string
  text: I18nText | string
}) {
  const { locale } = useI18n()
  return <Comp className={className}>{localize(text, locale)}</Comp>
}
