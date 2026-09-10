'use client'

import { useI18n } from '@/lib/i18n/provider'
import { Settings } from '@/types/settings'

export function Footer() {
  const { m } = useI18n()

  return (
    <footer className="flex w-full justify-end border-t px-6 py-5 text-xs text-muted-foreground sm:px-10">
      <a
        aria-label={Settings.name}
        className="transition-colors hover:text-foreground"
        href={Settings.link}
        rel="noopener noreferrer"
        target="_blank"
      >
        © {new Date().getFullYear()} {m.brand.name}
      </a>
    </footer>
  )
}
