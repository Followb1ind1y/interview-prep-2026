import { Link } from '@/lib/transition'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      aria-label="北极星 Polaris"
      className={className ?? 'hidden items-center gap-2.5 md:flex'}
      href="/"
      title="北极星 Polaris"
    >
      <PolarisMark className="size-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">北极星</span>
        <span className="mt-0.5 text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          Polaris
        </span>
      </span>
    </Link>
  )
}

export function PolarisMark({ className }: { className?: string }) {
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
        d="M16 5.5L17.55 13.35L25.5 16L17.55 18.65L16 26.5L14.45 18.65L6.5 16L14.45 13.35L16 5.5Z"
        fill="var(--background)"
      />
      <path
        d="M16 11.2L21.2 16L16 20.8L10.8 16L16 11.2Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}
