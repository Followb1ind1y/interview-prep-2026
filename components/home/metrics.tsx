'use client'

import { useEffect, useState } from 'react'

import { useI18n } from '@/lib/i18n/provider'

interface CountdownProps {
  companies: number
  notes: number
  targetDate: string
  activeDays: number
}

function diffTo(target: string) {
  const end = new Date(`${target}T23:59:59`)
  const now = new Date()
  const ms = Math.max(0, end.getTime() - now.getTime())
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  return { days, hours, minutes }
}

export function HomeMetrics({ targetDate, notes, companies, activeDays }: CountdownProps) {
  const { m } = useI18n()
  const [time, setTime] = useState(() => diffTo(targetDate))

  useEffect(() => {
    const id = window.setInterval(() => setTime(diffTo(targetDate)), 30_000)
    return () => window.clearInterval(id)
  }, [targetDate])

  return (
    <section className="mx-auto grid max-w-5xl grid-cols-2 gap-3 border-y py-10 sm:grid-cols-4">
      <Metric value={String(time.days)} label={m.home.countdown} unit={m.home.days} />
      <Metric value={String(notes)} label={m.home.notes} />
      <Metric value={String(companies)} label={m.home.companies} />
      <Metric value={String(activeDays)} label={m.home.activeMonth} />
    </section>
  )
}

function Metric({ value, label, unit }: { label: string; unit?: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      <span className="text-xs tracking-wide text-muted-foreground">{label}</span>
    </div>
  )
}
