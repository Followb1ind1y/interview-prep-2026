'use client'

import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { localize, type I18nText } from '@/lib/i18n/types'
import { Link } from '@/lib/transition'

interface HeroProps {
  bio: I18nText
  name: I18nText
  role: I18nText
}

export function HomeHero({ name, role, bio }: HeroProps) {
  const { locale, m } = useI18n()

  return (
    <section className="relative mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-2 py-20 text-center">
      <p className="mb-5 text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
        {m.home.kicker}
      </p>
      <h1 className="mb-3 text-4xl font-semibold tracking-tight sm:text-6xl">
        {m.home.greeting} {localize(name, locale)}
      </h1>
      <p className="mb-6 text-base text-muted-foreground sm:text-lg">{localize(role, locale)}</p>
      <p className="mb-10 max-w-150 text-sm leading-7 text-foreground/80 sm:text-[15px]">
        {localize(bio, locale)}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link className={buttonVariants({ className: 'px-6', size: 'lg' })} href="/docs/overview">
          {m.home.ctaDocs}
        </Link>
        <Link
          className={buttonVariants({ className: 'px-6', size: 'lg', variant: 'outline' })}
          href="#roadmap"
        >
          {m.home.ctaPlan}
        </Link>
      </div>
    </section>
  )
}
