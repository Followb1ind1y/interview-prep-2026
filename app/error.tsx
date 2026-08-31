'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const { m } = useI18n()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="flex min-h-[99vh] flex-col items-start gap-3 px-2 py-8">
      <div>
        <h2 className="text-5xl font-semibold tracking-tight">{m.common.oops}</h2>
        <p className="text-muted-foreground">{m.common.somethingWrong}</p>
      </div>
      <Button onClick={() => reset()}>{m.common.tryAgain}</Button>
    </section>
  )
}
