'use client'

import Link from 'next/link'
import { LuGithub } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { LocaleToggle } from '@/components/navigation/locale-toggle'
import { Logo } from '@/components/navigation/logo'
import { Search } from '@/components/navigation/search'
import { SheetLeft } from '@/components/sidebar'
import { buttonVariants } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { useI18n } from '@/lib/i18n/provider'
import { type StudyProgress } from '@/lib/study-status'
import { GitHubLink, Navigations } from '@/settings/navigation'

export function Navbar({ progress }: { progress: StudyProgress }) {
  const { m } = useI18n()

  return (
    <nav className="sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b bg-background/70 p-1 px-2 backdrop-blur-xl backdrop-filter sm:p-3 md:gap-2 md:px-4">
      <div className="flex items-center gap-5">
        <SheetLeft progress={progress} />
        <Logo />
        <div className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
          <NavMenu />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search />
        <div className="flex gap-2 sm:ml-0">
          {GitHubLink.href && (
            <Link
              aria-label={m.nav.github}
              className={buttonVariants({ variant: 'outline', size: 'icon-lg' })}
              href={GitHubLink.href}
              rel="noopener noreferrer"
              target="_blank"
              title={m.nav.github}
            >
              <LuGithub className="size-4" />
            </Link>
          )}
          <LocaleToggle />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  const { m } = useI18n()

  return (
    <>
      {Navigations.map((item) => {
        const Comp = (
          <Anchor
            absolute
            activeClassName="font-semibold text-primary"
            className="flex items-center gap-1 text-sm"
            href={item.href}
            key={item.id + item.href}
          >
            {m.nav[item.id]}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose asChild key={item.id + item.href}>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
