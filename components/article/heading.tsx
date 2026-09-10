'use client'

import { useI18n } from '@/lib/i18n/provider'
import { formatIsoDate } from '@/lib/utils'

/** Frontmatter writes keywords as a YAML list, but a single string is tolerated. */
function toKeywords(value: string | string[] | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return value
    .split(',')
    .map((keyword) => keyword.trim())
    .filter(Boolean)
}

/** YAML turns an unquoted `date: 2026-09-07` into a Date, so normalise both shapes. */
function toIsoDay(value: string | Date | undefined): string | null {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10)
  }
  return value
}

export function DocumentHeading({
  title,
  titleEn,
  description,
  descriptionEn,
  date,
  keywords,
}: {
  date?: string | Date
  description?: string
  descriptionEn?: string
  keywords?: string | string[]
  title: string
  titleEn?: string
}) {
  const { locale, m } = useI18n()
  const heading = locale === 'en' && titleEn ? titleEn : title
  const lead = locale === 'en' && descriptionEn ? descriptionEn : description
  const tags = toKeywords(keywords)
  const day = toIsoDay(date)

  return (
    <>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {lead && <p className="mt-2 text-sm text-muted-foreground">{lead}</p>}

      {(day || tags.length > 0) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {day && (
            <span>
              {m.docs.updated} {formatIsoDate(day, locale)}
            </span>
          )}
          {tags.map((tag) => (
            <span className="rounded-md border px-2 py-0.5 leading-normal" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
