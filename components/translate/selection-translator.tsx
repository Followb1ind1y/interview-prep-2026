'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LuLanguages, LuLoaderCircle } from 'react-icons/lu'

import { TranslatePanel } from '@/components/translate/panel'
import { type CapturedSelection, useTextSelection } from '@/components/translate/use-text-selection'
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { localKey, readCached, writeCached } from '@/lib/translate/client-cache'
import { type TranslateResponse } from '@/lib/translate/types'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'done' | 'error'

const PANEL_WIDTH = 360
const GAP = 8
/** 下方剩余空间不够就翻到选区上方 */
const MIN_SPACE_BELOW = 280

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

function floatingStyle(rect: DOMRect, width: number): React.CSSProperties {
  const left = Math.min(Math.max(GAP, rect.left), Math.max(GAP, window.innerWidth - width - GAP))
  const spaceBelow = window.innerHeight - rect.bottom

  if (spaceBelow >= MIN_SPACE_BELOW) {
    return { left, top: rect.bottom + GAP, width }
  }
  return { left, bottom: window.innerHeight - rect.top + GAP, width }
}

export function SelectionTranslator() {
  const { m } = useI18n()
  const { selection, rect, clear } = useTextSelection()

  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<TranslateResponse | null>(null)
  const [errorCode, setErrorCode] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => setMounted(true), [])

  // 换了一段选区就重置，避免旧结果挂在新选中的文字下面
  const active = selection?.text ?? ''
  const tracked = useRef(active)
  if (tracked.current !== active) {
    tracked.current = active
    abortRef.current?.abort()
    setStatus('idle')
    setData(null)
    setErrorCode('')
  }

  const translate = useCallback(async (target: CapturedSelection) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const key = localKey(target.text, target.context)
    const cached = readCached(key)
    if (cached) {
      setData(cached)
      setStatus('done')
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('/api/translate', {
        body: JSON.stringify(target),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      })
      const payload = await response.json()

      if (!response.ok) {
        setErrorCode(typeof payload?.error === 'string' ? payload.error : 'unexpected-error')
        setStatus('error')
        return
      }

      writeCached(key, payload as TranslateResponse)
      setData(payload as TranslateResponse)
      setStatus('done')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setErrorCode('network-error')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        clear()
        return
      }
      if (event.key !== 't' && event.key !== 'T') return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target)) return
      if (!selection || status !== 'idle') return

      event.preventDefault()
      void translate(selection)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [clear, selection, status, translate])

  if (!mounted || !selection || !rect) return null

  const width = Math.min(PANEL_WIDTH, window.innerWidth - GAP * 2)

  if (status === 'idle') {
    return createPortal(
      <button
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'fixed z-50 gap-1.5 shadow-md'
        )}
        data-translate-ui=""
        onClick={() => void translate(selection)}
        style={{
          left: Math.min(Math.max(GAP, rect.left), Math.max(GAP, window.innerWidth - 120)),
          top: rect.bottom + GAP,
        }}
        title={m.translate.title}
        type="button"
      >
        <LuLanguages />
        <span>{m.translate.action}</span>
        <kbd className="rounded border border-border px-1 text-[0.65rem] text-muted-foreground">
          T
        </kbd>
      </button>,
      document.body
    )
  }

  return createPortal(
    <div
      className="fixed z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-popover p-3 shadow-lg"
      data-translate-ui=""
      style={floatingStyle(rect, width)}
    >
      {status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLoaderCircle className="animate-spin" />
          <span>{m.translate.loading}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-destructive">{errorMessage(errorCode, m)}</p>
          <button
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'self-start')}
            onClick={() => void translate(selection)}
            type="button"
          >
            {m.translate.retry}
          </button>
        </div>
      )}

      {status === 'done' && data && (
        <TranslatePanel data={data} onClose={clear} source={selection.text} />
      )}
    </div>,
    document.body
  )
}

function errorMessage(code: string, m: ReturnType<typeof useI18n>['m']): string {
  switch (code) {
    case 'missing-api-key':
    case 'invalid-api-key':
      return m.translate.errorKey
    case 'rate-limited':
    case 'upstream-rate-limited':
      return m.translate.errorRate
    case 'selection-too-long':
      return m.translate.errorLong
    default:
      return m.translate.error
  }
}
