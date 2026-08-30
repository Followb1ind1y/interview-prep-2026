'use client'

import { useTheme } from 'next-themes'
import { RxMoon, RxSun } from 'react-icons/rx'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { m } = useI18n()

  return (
    <Button
      aria-label={m.nav.theme}
      className="h-9 w-9 cursor-pointer"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      size="icon"
      title={m.nav.theme}
      variant="outline"
    >
      <RxSun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <RxMoon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{m.nav.theme}</span>
    </Button>
  )
}
