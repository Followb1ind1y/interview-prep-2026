'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LuHighlighter, LuLanguages, LuLoaderCircle, LuMessageSquarePlus } from 'react-icons/lu'

import { useAnnotate } from '@/components/annotate/provider'
import { TranslatePanel } from '@/components/translate/panel'
import { type CapturedSelection, useTextSelection } from '@/components/translate/use-text-selection'
import { buttonVariants } from '@/components/ui/button'
import { floatingStyle, GAP } from '@/lib/floating'
import { useI18n } from '@/lib/i18n/provider'
import { localKey, readCached, writeCached } from '@/lib/translate/client-cache'
import { type TranslateResponse } from '@/lib/translate/types'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'loading' | 'done' | 'error'

const PANEL_WIDTH = 360
/** 下方剩余空间不够就翻到选区上方 */
const MIN_SPACE_BELOW = 280
/** 工具条的大致宽度，只用来防止贴着右边时溢出视口 */
const TOOLBAR_WIDTH = { full: 300, single: 180 }

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

function Shortcut({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-border px-1 text-[0.65rem] text-muted-foreground">
      {children}
    </kbd>
  )
}

export function SelectionTranslator() {
  const { m } = useI18n()
  const annotate = useAnnotate()
  const { selection, range, rect, translatable, clear } = useTextSelection()

  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<TranslateResponse | null>(null)
  const [errorCode, setErrorCode] = useState('')
  const [saved, setSaved] = useState(false)
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
    setSaved(false)
  }

  const annotatable = range != null && annotate.canAnnotate(range)

  const translate = useCallback(
    async (target: CapturedSelection) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      // 本页存成过批注的翻译优先：它不会像下面的缓存那样被挤掉
      const fromNote = annotate.findTranslation(target.text)
      if (fromNote) {
        const { direction, ...result } = fromNote
        setData({ direction, model: 'annotation', result })
        setSaved(true)
        setStatus('done')
        return
      }
      setSaved(false)

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
    },
    [annotate]
  )

  const saveAsNote = useCallback(() => {
    if (!range || !data) return
    annotate.saveTranslation(range, { ...data.result, direction: data.direction })
    // 关掉面板，波浪线马上出现，悬停就能看到
    window.getSelection()?.removeAllRanges()
    clear()
  }, [annotate, clear, data, range])

  const mark = useCallback(
    (kind: 'highlight' | 'note') => {
      if (!range) return
      if (kind === 'highlight') annotate.highlight(range)
      else annotate.note(range)
      // 原生选区的蓝底会盖住刚画上去的颜色
      window.getSelection()?.removeAllRanges()
      clear()
    },
    [annotate, clear, range]
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        clear()
        return
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target) || !selection) return

      const key = event.key.toLowerCase()
      if (key === 't' && translatable && status === 'idle') {
        event.preventDefault()
        void translate(selection)
      } else if ((key === 'h' || key === 'n') && annotatable) {
        event.preventDefault()
        mark(key === 'h' ? 'highlight' : 'note')
      } else if (key === 's' && status === 'done' && annotatable && !saved) {
        event.preventDefault()
        saveAsNote()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [annotatable, clear, mark, saveAsNote, saved, selection, status, translatable, translate])

  if (!mounted || !selection || !rect) return null
  if (!translatable && !annotatable) return null

  const width = Math.min(PANEL_WIDTH, window.innerWidth - GAP * 2)

  if (status === 'idle') {
    const toolbarWidth = translatable && annotatable ? TOOLBAR_WIDTH.full : TOOLBAR_WIDTH.single
    const action = cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')

    return createPortal(
      <div
        className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5 shadow-md dark:border-input"
        data-translate-ui=""
        style={{
          left: Math.min(Math.max(GAP, rect.left), Math.max(GAP, window.innerWidth - toolbarWidth)),
          top: rect.bottom + GAP,
        }}
      >
        {translatable && (
          <button
            className={action}
            onClick={() => void translate(selection)}
            title={m.translate.title}
            type="button"
          >
            <LuLanguages />
            <span>{m.translate.action}</span>
            <Shortcut>T</Shortcut>
          </button>
        )}
        {translatable && annotatable && (
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-border" />
        )}
        {annotatable && (
          <>
            <button
              className={action}
              onClick={() => mark('highlight')}
              title={m.annotate.highlight}
              type="button"
            >
              <LuHighlighter />
              <span>{m.annotate.highlight}</span>
              <Shortcut>H</Shortcut>
            </button>
            <button
              className={action}
              onClick={() => mark('note')}
              title={m.annotate.note}
              type="button"
            >
              <LuMessageSquarePlus />
              <span>{m.annotate.note}</span>
              <Shortcut>N</Shortcut>
            </button>
          </>
        )}
      </div>,
      document.body
    )
  }

  return createPortal(
    <div
      className="fixed z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-popover p-3 shadow-lg"
      data-translate-ui=""
      style={floatingStyle(rect, width, MIN_SPACE_BELOW)}
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
        <TranslatePanel
          data={data}
          onClose={clear}
          onSave={annotatable && !saved ? saveAsNote : undefined}
          saved={saved}
          source={selection.text}
        />
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
