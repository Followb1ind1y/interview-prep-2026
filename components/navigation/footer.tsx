'use client'

import Link from 'next/link'

import { PolarisMark } from '@/components/navigation/logo'
import { useI18n } from '@/lib/i18n/provider'
import { Settings } from '@/types/settings'

export function Footer() {
  const { m } = useI18n()

  return (
    <footer className="flex h-16 w-full flex-wrap items-center justify-center gap-4 border-t px-2 py-3 text-sm text-foreground sm:justify-between sm:gap-0 sm:px-4 sm:py-0 lg:px-8">
      <p className="flex items-center gap-2">
        <PolarisMark className="size-5" />
        <span>
          © {new Date().getFullYear()} {m.brand.name}
        </span>
      </p>
      <Link
        aria-label={Settings.name}
        className="text-muted-foreground hover:text-foreground"
        href={Settings.link}
        rel="noopener noreferrer"
        target="_blank"
      >
        {Settings.name}
      </Link>
    </footer>
  )
}
