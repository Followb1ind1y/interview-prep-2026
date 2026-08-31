import { Link } from '@/lib/transition'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      aria-label="Followblindly"
      className={className ?? 'hidden items-center gap-2.5 md:flex'}
      href="/"
      title="Followblindly"
    >
      <BrandMark className="size-8" />
      <span className="text-[15px] font-semibold tracking-tight">Followblindly</span>
    </Link>
  )
}

/** Three ascending steps — prep progress, not letterforms. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="32" rx="8" width="32" />
      <path
        d="M8 22h4.5v-3.5H8V22Zm5.75 0h4.5v-7h-4.5V22Zm5.75 0H24V8h-4.5v14Z"
        fill="var(--background)"
      />
    </svg>
  )
}
