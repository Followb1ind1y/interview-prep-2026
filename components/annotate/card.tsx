'use client'

import { type ReactNode, useState } from 'react'
import {
  LuEraser,
  LuHighlighter,
  LuLanguages,
  LuMessageSquarePlus,
  LuPencil,
  LuTrash2,
  LuX,
} from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { editable } from '@/lib/annotate/store'
import { type Annotation, type SavedTranslation } from '@/lib/annotate/types'
import { useI18n } from '@/lib/i18n/provider'
import { cn } from '@/lib/utils'

/** 创建后一分钟内的改动不算「编辑过」 */
const EDIT_THRESHOLD = 60_000

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

interface ItemProps {
  annotation: Annotation
  onAddNote: (annotation: Annotation) => void
  onEdit: (annotation: Annotation) => void
  onRemove: (annotation: Annotation) => void
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Button
      aria-label={label}
      className="text-muted-foreground"
      onClick={onClick}
      size="icon-xs"
      title={label}
      type="button"
      variant="ghost"
    >
      {children}
    </Button>
  )
}

function TranslationBlock({ translation }: { translation: SavedTranslation }) {
  const { m } = useI18n()

  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
        <LuLanguages className="size-3 shrink-0" />
        {translation.direction === 'zh2en' ? m.translate.toEn : m.translate.toZh}
        {translation.pos ? ` · ${translation.pos}` : ''}
      </span>
      <p className="text-sm leading-relaxed font-medium break-words text-foreground">
        {translation.primary}
      </p>
      {translation.note && (
        <p className="text-xs leading-relaxed text-muted-foreground">{translation.note}</p>
      )}
    </div>
  )
}

function NoteItem({ annotation, onEdit, onRemove }: ItemProps) {
  const { m } = useI18n()
  const [confirming, setConfirming] = useState(false)
  const edited = annotation.updatedAt - annotation.createdAt > EDIT_THRESHOLD

  return (
    <div className="flex flex-col gap-2">
      {annotation.translation && <TranslationBlock translation={annotation.translation} />}
      {annotation.note && (
        <p
          className={cn(
            'text-sm leading-relaxed break-words whitespace-pre-wrap text-foreground',
            annotation.translation && 'border-t border-border pt-2'
          )}
        >
          {annotation.note}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <time
          className="text-[0.7rem] text-muted-foreground"
          dateTime={new Date(annotation.createdAt).toISOString()}
        >
          {formatTime(annotation.createdAt)}
          {edited && ` · ${m.annotate.edited} ${formatTime(annotation.updatedAt)}`}
        </time>
        {editable && (
          <div className="flex shrink-0 items-center gap-0.5">
            {confirming ? (
              <>
                <IconButton label={m.annotate.cancel} onClick={() => setConfirming(false)}>
                  <LuX />
                </IconButton>
                <Button
                  onClick={() => onRemove(annotation)}
                  size="xs"
                  type="button"
                  variant="destructive"
                >
                  {m.annotate.confirmRemove}
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  label={annotation.note ? m.annotate.edit : m.annotate.addNote}
                  onClick={() => onEdit(annotation)}
                >
                  <LuPencil />
                </IconButton>
                <IconButton label={m.annotate.remove} onClick={() => setConfirming(true)}>
                  <LuTrash2 />
                </IconButton>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function HighlightItem({ annotation, onAddNote, onRemove }: ItemProps) {
  const { m } = useI18n()

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5 text-[0.7rem] text-muted-foreground">
        <LuHighlighter className="size-3 shrink-0" />
        <time dateTime={new Date(annotation.createdAt).toISOString()}>
          {m.annotate.highlighted} {formatTime(annotation.createdAt)}
        </time>
      </span>
      {editable && (
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label={m.annotate.addNote} onClick={() => onAddNote(annotation)}>
            <LuMessageSquarePlus />
          </IconButton>
          <IconButton label={m.annotate.removeHighlight} onClick={() => onRemove(annotation)}>
            <LuEraser />
          </IconButton>
        </div>
      )}
    </div>
  )
}

export function AnnotationCard({
  items,
  ...handlers
}: Omit<ItemProps, 'annotation'> & { items: Annotation[] }) {
  // 同一处既有批注又有高亮时，批注排前面
  const sorted = [...items].sort((a, b) =>
    a.kind === b.kind ? a.createdAt - b.createdAt : a.kind === 'note' ? -1 : 1
  )

  return (
    <div className="flex flex-col divide-y divide-border">
      {sorted.map((annotation) => (
        <div className="py-2.5 first:pt-0 last:pb-0" key={annotation.id}>
          {annotation.kind === 'note' ? (
            <NoteItem annotation={annotation} {...handlers} />
          ) : (
            <HighlightItem annotation={annotation} {...handlers} />
          )}
        </div>
      ))}
    </div>
  )
}
