'use client'

import { useEffect, useRef, useState } from 'react'

import { useRangeRect } from '@/components/annotate/use-range-rect'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { type EditorState } from '@/lib/annotate/types'
import { floatingStyle, GAP } from '@/lib/floating'
import { useI18n } from '@/lib/i18n/provider'

const WIDTH = 340
const MIN_SPACE_BELOW = 240
const MAX_LENGTH = 2000

export function NoteEditor({
  editor,
  onClose,
  onSave,
}: {
  editor: EditorState
  onClose: () => void
  onSave: (note: string) => void
}) {
  const { m } = useI18n()
  const initial = editor.mode === 'edit' ? (editor.annotation.note ?? '') : ''
  const quote = editor.mode === 'edit' ? editor.annotation.quote.exact : editor.quote.exact

  const [draft, setDraft] = useState(initial)
  const rect = useRangeRect(editor.range)
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const dirty = draft.trim() !== initial.trim()

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    input.focus({ preventScroll: true })
    input.setSelectionRange(input.value.length, input.value.length)
  }, [])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && panelRef.current?.contains(event.target)) return
      // 点到外面：没改过就收起；写了一半的不丢，要显式点取消
      if (!dirty) onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [dirty, onClose])

  function submit() {
    const value = draft.trim()
    if (value) onSave(value)
  }

  return (
    <div
      className="fixed z-50 flex flex-col gap-2 rounded-lg border border-border bg-popover p-3 shadow-lg"
      data-annotate-ui=""
      ref={panelRef}
      style={floatingStyle(rect, Math.min(WIDTH, window.innerWidth - GAP * 2), MIN_SPACE_BELOW)}
    >
      <blockquote className="line-clamp-2 border-l-2 border-border pl-2 text-xs break-words text-muted-foreground">
        {quote}
      </blockquote>
      <Textarea
        className="max-h-60 min-h-20 resize-none text-sm"
        maxLength={MAX_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault()
            submit()
          } else if (event.key === 'Escape') {
            event.preventDefault()
            onClose()
          }
        }}
        placeholder={m.annotate.placeholder}
        ref={inputRef}
        value={draft}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.7rem] text-muted-foreground">{m.annotate.saveHint}</span>
        <div className="flex items-center gap-1.5">
          <Button onClick={onClose} size="sm" type="button" variant="ghost">
            {m.annotate.cancel}
          </Button>
          <Button disabled={!draft.trim() || !dirty} onClick={submit} size="sm" type="button">
            {m.annotate.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
