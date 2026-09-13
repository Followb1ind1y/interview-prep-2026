'use client'

import { useMemo, useState } from 'react'

import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

interface ActivityDay {
  count: number
  date: string
}

const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六']
const WEEKDAYS_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/**
 * Minimum count to reach shade 1–4. Fixed buckets instead of "relative to the busiest day":
 * one bulk day (e.g. 80 note pages created at once) would otherwise wash every normal study
 * day out to the palest shade.
 */
const LEVEL_MINIMUMS = [1, 3, 6, 12]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function levelFor(count: number) {
  return LEVEL_MINIMUMS.filter((min) => count >= min).length
}

export function HomeHeatmap({ activity }: { activity: ActivityDay[] }) {
  const { locale, m } = useI18n()
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })

  const countMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const day of activity) map.set(day.date, day.count)
    return map
  }, [activity])

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const total = daysInMonth(cursor.year, cursor.month)
    const offset = first.getDay()
    const result: { date: string | null; count: number }[] = []

    for (let i = 0; i < offset; i++) result.push({ date: null, count: 0 })
    for (let day = 1; day <= total; day++) {
      const date = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      result.push({ date, count: countMap.get(date) ?? 0 })
    }
    return result
  }, [cursor, countMap])

  const label = new Date(cursor.year, cursor.month, 1).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long' }
  )
  const weekdays = locale === 'zh' ? WEEKDAYS_ZH : WEEKDAYS_EN

  const canNext =
    cursor.year < now.getFullYear() ||
    (cursor.year === now.getFullYear() && cursor.month < now.getMonth())

  return (
    <section className="mx-auto max-w-3xl py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs tracking-[0.22em] text-muted-foreground uppercase">Activity</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{m.home.activity}</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            className="rounded-md border px-2 py-1 text-muted-foreground hover:text-foreground"
            onClick={() =>
              setCursor((prev) => {
                const month = prev.month - 1
                return month < 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month }
              })
            }
            type="button"
          >
            ‹
          </button>
          <span className="min-w-28 text-center font-medium">{label}</span>
          <button
            className="rounded-md border px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
            disabled={!canNext}
            onClick={() =>
              setCursor((prev) => {
                const month = prev.month + 1
                return month > 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month }
              })
            }
            type="button"
          >
            ›
          </button>
        </div>
      </header>

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[11px] text-muted-foreground">
          {weekdays.map((day, i) => (
            <span key={`${day}-${i}`}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, i) => (
            <div
              className={cn(
                'aspect-square rounded-[4px] border',
                cell.date ? `heat-${levelFor(cell.count)}` : 'border-transparent bg-transparent'
              )}
              key={cell.date ?? `empty-${i}`}
              title={
                cell.date
                  ? locale === 'zh'
                    ? `${cell.date} · ${cell.count} 条更新`
                    : `${cell.date} · ${cell.count} updates`
                  : undefined
              }
            />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground">
          <span>{m.home.less}</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span className={cn('size-3 rounded-[3px] border', `heat-${level}`)} key={level} />
          ))}
          <span>{m.home.more}</span>
        </div>
      </div>
    </section>
  )
}
