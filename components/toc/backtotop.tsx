'use client'

import { type ReactElement, useEffect, useRef } from 'react'
import { LuArrowUp } from 'react-icons/lu'

import { useI18n } from '@/lib/i18n/provider'

function ScrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function BackToTop(): ReactElement {
  const { m } = useI18n()
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function toggleVisible() {
      const { scrollTop } = document.documentElement
      if (ref.current) {
        ref.current.classList.toggle('opacity-0', scrollTop < 300)
      }
    }

    window.addEventListener('scroll', toggleVisible)
    return () => {
      window.removeEventListener('scroll', toggleVisible)
    }
  }, [])

  return (
    <button
      aria-label={m.docs.backToTop}
      className="mt-2 ml-3 flex cursor-pointer items-center self-start text-sm text-foreground opacity-0 transition"
      onClick={ScrollToTop}
      ref={ref}
      title={m.docs.backToTop}
      type="button"
    >
      <LuArrowUp className="mr-1 inline-block h-4 w-4 align-middle" />
      <span>{m.docs.backToTop}</span>
    </button>
  )
}
