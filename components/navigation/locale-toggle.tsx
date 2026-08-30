'use client'

import { useI18n } from '@/lib/i18n/provider'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LocaleToggle() {
  const { locale, setLocale, m } = useI18n()
  const next = locale === 'zh' ? 'en' : 'zh'

  return (
    <button
      aria-label={m.nav.language}
      className={cn(buttonVariants({ variant: 'outline', size: 'icon-lg' }), 'text-xs font-semibold')}
      onClick={() => setLocale(next)}
      title={m.nav.language}
      type="button"
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  )
}
