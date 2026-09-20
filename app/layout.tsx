import { type ReactNode } from 'react'
import { type Metadata } from 'next'
import { Inter, Noto_Sans_SC } from 'next/font/google'
import { cookies } from 'next/headers'

import { Footer } from '@/components/navigation/footer'
import { Navbar } from '@/components/navigation/navbar'
import { SelectionTranslator } from '@/components/translate/selection-translator'
import { isLocale } from '@/lib/i18n/types'
import { getStudyProgress } from '@/lib/study-progress'
import { Providers } from '@/providers'
import { Settings } from '@/types/settings'

import '@/styles/globals.css'

const inter = Inter({
  adjustFontFallback: true,
  display: 'swap',
  preload: true,
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansSc = Noto_Sans_SC({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-noto',
  weight: ['400', '500', '600', '700'],
})

const baseUrl = Settings.metadataBase

export const metadata: Metadata = {
  title: Settings.title,
  metadataBase: new URL(baseUrl),
  description: Settings.description,
  keywords: Settings.keywords,
  openGraph: {
    type: Settings.openGraph.type,
    url: baseUrl,
    title: Settings.openGraph.title,
    description: Settings.openGraph.description,
    siteName: Settings.openGraph.siteName,
    images: Settings.openGraph.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  twitter: {
    card: Settings.twitter.card,
    title: Settings.twitter.title,
    description: Settings.twitter.description,
    site: Settings.twitter.site,
    images: Settings.twitter.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  publisher: Settings.name,
  icons: {
    icon: '/icon.svg',
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [cookieStore, progress] = await Promise.all([cookies(), getStudyProgress('docs')])
  const rawLocale = cookieStore.get('locale')?.value
  const locale = isLocale(rawLocale) ? rawLocale : 'zh'

  return (
    <html
      className={`${inter.variable} ${notoSansSc.variable}`}
      data-scroll-behavior="smooth"
      lang={locale === 'zh' ? 'zh-CN' : 'en'}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers locale={locale}>
          <Navbar progress={progress} />
          <main className="h-auto px-5 sm:px-8">{children}</main>
          <Footer />
          <SelectionTranslator />
        </Providers>
      </body>
    </html>
  )
}
