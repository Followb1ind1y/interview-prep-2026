'use client'

import { createContext, useContext, type ReactNode } from 'react'

import { type StudyStatus } from '@/lib/paths'
import { type StudyProgress } from '@/lib/study-status'

const StudyProgressContext = createContext<StudyProgress>({})

export function StudyProgressProvider({
  children,
  progress,
}: {
  children: ReactNode
  progress: StudyProgress
}) {
  return <StudyProgressContext.Provider value={progress}>{children}</StudyProgressContext.Provider>
}

export function useStudyProgress(): StudyProgress {
  return useContext(StudyProgressContext)
}

export function useHrefStudyStatus(href?: string): StudyStatus | undefined {
  const progress = useStudyProgress()
  if (!href) return undefined
  return progress[href]
}
