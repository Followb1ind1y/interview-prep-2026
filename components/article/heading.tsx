'use client'

import { useI18n } from '@/lib/i18n/provider'

export function DocumentHeading({
  title,
  titleEn,
  description,
  descriptionEn,
}: {
  description?: string
  descriptionEn?: string
  title: string
  titleEn?: string
}) {
  const { locale } = useI18n()
  const heading = locale === 'en' && titleEn ? titleEn : title
  const lead = locale === 'en' && descriptionEn ? descriptionEn : description

  return (
    <>
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {lead && <p className="text-sm text-muted-foreground">{lead}</p>}
    </>
  )
}
