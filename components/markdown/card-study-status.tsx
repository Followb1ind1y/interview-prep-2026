'use client'

import { StudyStatusIcon } from '@/components/study-status'
import { useHrefStudyStatus } from '@/components/study-progress-provider'

export function CardStudyStatus({ href }: { href?: string }) {
  const status = useHrefStudyStatus(href)
  if (status !== 'doing' && status !== 'done') return null
  return <StudyStatusIcon status={status} />
}
