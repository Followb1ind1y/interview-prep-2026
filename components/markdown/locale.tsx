'use client'

import { type PropsWithChildren } from 'react'

import { useI18n } from '@/lib/i18n/provider'
import { type Locale as LocaleCode } from '@/lib/i18n/types'

interface LocaleProps extends PropsWithChildren {
  lang: LocaleCode
}

/** Renders children only when the active locale matches `lang`. */
export function Locale({ lang, children }: LocaleProps) {
  const { locale } = useI18n()
  if (locale !== lang) return null
  return <>{children}</>
}
