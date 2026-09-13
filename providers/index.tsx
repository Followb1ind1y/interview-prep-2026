import { type ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'

import { AnnotateProvider } from '@/components/annotate/provider'
import { I18nProvider } from '@/lib/i18n/provider'
import { type Locale } from '@/lib/i18n/types'
import { ViewTransitions } from '@/lib/transition'

export function Providers({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <I18nProvider defaultLocale={locale}>
        <AnnotateProvider>
          <ViewTransitions>{children}</ViewTransitions>
        </AnnotateProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
