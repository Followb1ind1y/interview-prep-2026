'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { messages, type Messages } from '@/lib/i18n/messages'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/types'

const STORAGE_KEY = 'polaris-locale'

interface I18nContextValue {
  locale: Locale
  m: Messages
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  defaultLocale: initial = defaultLocale,
}: {
  children: ReactNode
  defaultLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initial)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved) && saved !== locale) {
      setLocaleState(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    document.cookie = `locale=${next};path=/;max-age=31536000;SameSite=Lax`
  }, [])

  const value = useMemo(
    () => ({
      locale,
      m: messages[locale],
      setLocale,
    }),
    [locale, setLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
