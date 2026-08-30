'use client'

import { useI18n } from '@/lib/i18n/provider'
import { localize, type I18nText } from '@/lib/i18n/types'
import { cn } from '@/lib/utils'

export interface RoadmapPhase {
  id: string
  items: { en: string[]; zh: string[] }
  phase: I18nText
  status: 'todo' | 'doing' | 'done'
  time: I18nText
}

export function HomeRoadmap({ phases }: { phases: RoadmapPhase[] }) {
  const { locale, m } = useI18n()
  const statusLabel = {
    todo: m.home.statusTodo,
    doing: m.home.statusDoing,
    done: m.home.statusDone,
  }

  return (
    <section className="mx-auto max-w-5xl py-20" id="roadmap">
      <header className="mb-10">
        <p className="mb-2 text-xs tracking-[0.22em] text-muted-foreground uppercase">Plan</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{m.home.roadmap}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{m.home.roadmapHint}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {phases.map((phase) => {
          const items = phase.items[locale]
          return (
            <article className="rounded-xl border bg-card p-5" key={phase.id}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{localize(phase.phase, locale)}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{localize(phase.time, locale)}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full border px-2 py-0.5 text-[11px]',
                    phase.status === 'doing' && 'border-foreground text-foreground',
                    phase.status === 'done' && 'bg-foreground text-background',
                    phase.status === 'todo' && 'text-muted-foreground'
                  )}
                >
                  {statusLabel[phase.status]}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground/50" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
