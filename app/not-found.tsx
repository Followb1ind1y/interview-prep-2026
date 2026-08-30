'use client'

import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { Link } from '@/lib/transition'

export default function NotFound() {
  const { m } = useI18n()

  return (
    <div className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">404</h1>
      <p className="mb-8 max-w-150 text-foreground sm:text-base">{m.common.notFound}</p>
      <Button asChild size="lg" variant="default">
        <Link href="/">{m.common.returnHome}</Link>
      </Button>
    </div>
  )
}
