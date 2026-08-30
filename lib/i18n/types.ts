export type Locale = 'zh' | 'en'

export type I18nText = {
  en: string
  zh: string
}

export const defaultLocale: Locale = 'zh'
export const locales: Locale[] = ['zh', 'en']

export function isLocale(value: string | undefined | null): value is Locale {
  return value === 'zh' || value === 'en'
}

export function localize(text: I18nText | string, locale: Locale): string {
  if (typeof text === 'string') return text
  return text[locale]
}
