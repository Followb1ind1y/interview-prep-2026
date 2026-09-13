'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { AnnotationCard } from '@/components/annotate/card'
import { NoteEditor } from '@/components/annotate/editor'
import { annotationRoot, resolveAll } from '@/lib/annotate/anchor'
import { addAnnotation, removeAnnotation, updateNote } from '@/lib/annotate/store'
import { type Annotation, type EditorState } from '@/lib/annotate/types'
import { floatingStyle, GAP } from '@/lib/floating'

const MARK = 'annotate-mark'
const NOTE = 'annotate-note'
const ACTIVE = 'annotate-active'

/**
 * Turbopack 的 CSS 解析器不认识 ::highlight()，写进 globals.css 会反复报警告，所以运行时注入。
 * 颜色变量仍在 styles/globals.css，暗色跟着 .dark 切换。
 * ::highlight() 里只允许 color / background-color / text-decoration 系列属性。
 */
const HIGHLIGHT_CSS = `
::highlight(${MARK}) { background-color: var(--annotate-mark); }
::highlight(${NOTE}) {
  text-decoration-line: underline;
  text-decoration-style: wavy;
  text-decoration-color: var(--annotate-note);
  text-decoration-thickness: 1.5px;
}
::highlight(${ACTIVE}) { background-color: var(--annotate-active); }
`

const OPEN_DELAY = 150
/** 留点时间让鼠标从文字挪进卡片 */
const CLOSE_DELAY = 250
const REANCHOR_DELAY = 120
const OWN_UI = '[data-annotate-ui]'

interface Hover {
  ids: string[]
  /** 鼠标所在那一行的矩形，卡片贴着它放 */
  rect: DOMRect
}

/**
 * 看事件路径而不是 event.target：点「删除」后 React 当场把按钮换成「确认删除」，
 * 事件冒泡到 document 时 target 已经脱离 DOM，closest() 找不到卡片，会被误判成点到了外面。
 * composedPath() 只在派发期间有效，异步回调里要提前算好。
 */
function insideOwnUi(event: Event): boolean {
  return event.composedPath().some((node) => node instanceof Element && node.matches(OWN_UI))
}

function hasSelection(): boolean {
  const selection = window.getSelection()
  return selection != null && !selection.isCollapsed
}

/**
 * 把存下来的文字引用定位成 Range。
 * 正文被 React 重渲染（切语言、客户端跳转、MDX 热更新）后旧 Range 会失效，所以监听 DOM 变化重算。
 */
function useAnchoredRanges(annotations: Annotation[]): Map<string, Range> {
  const [ranges, setRanges] = useState(() => new Map<string, Range>())

  useEffect(() => {
    const root = annotationRoot()
    if (!root || annotations.length === 0) {
      setRanges(new Map())
      return
    }

    let timer = 0
    const anchor = () => setRanges(resolveAll(root, annotations))
    anchor()

    const observer = new MutationObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(anchor, REANCHOR_DELAY)
    })
    observer.observe(root, { characterData: true, childList: true, subtree: true })

    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [annotations])

  return ranges
}

export function AnnotationLayer({
  annotations,
  editor,
  onEditorChange,
  path,
}: {
  annotations: Annotation[]
  editor: EditorState | null
  onEditorChange: (next: EditorState | null) => void
  path: string
}) {
  const ranges = useAnchoredRanges(annotations)
  const [hover, setHover] = useState<Hover | null>(null)
  const shownKey = useRef('')
  const pendingKey = useRef('')
  const openTimer = useRef(0)
  const closeTimer = useRef(0)

  const hide = useCallback(() => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = 0
    pendingKey.current = ''
    shownKey.current = ''
    setHover(null)
  }, [])

  useEffect(() => {
    const marks = new Highlight()
    const notes = new Highlight()
    for (const annotation of annotations) {
      const range = ranges.get(annotation.id)
      if (range) (annotation.kind === 'note' ? notes : marks).add(range)
    }
    CSS.highlights.set(MARK, marks)
    CSS.highlights.set(NOTE, notes)
  }, [annotations, ranges])

  useEffect(() => {
    const active = new Highlight()
    active.priority = 1
    for (const id of hover?.ids ?? []) {
      const range = ranges.get(id)
      if (range) active.add(range)
    }
    // 写批注时原生选区已经没了，靠这层让人看得见正在批注哪一段
    if (editor) active.add(editor.range)
    CSS.highlights.set(ACTIVE, active)
  }, [editor, hover, ranges])

  useEffect(() => {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(HIGHLIGHT_CSS)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]

    return () => {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((item) => item !== sheet)
      for (const name of [MARK, NOTE, ACTIVE]) CSS.highlights.delete(name)
    }
  }, [])

  useEffect(() => {
    if (editor || ranges.size === 0) {
      hide()
      return
    }

    function hitTest(x: number, y: number): Hover | null {
      const ids: string[] = []
      let hitRect: DOMRect | null = null
      for (const annotation of annotations) {
        const range = ranges.get(annotation.id)
        if (!range) continue
        for (const rect of Array.from(range.getClientRects())) {
          if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue
          ids.push(annotation.id)
          hitRect ??= rect
          break
        }
      }
      return hitRect ? { ids, rect: hitRect } : null
    }

    function show(next: Hover, delay: number) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = 0

      const key = next.ids.join(',')
      if (key === shownKey.current) {
        window.clearTimeout(openTimer.current)
        pendingKey.current = ''
        return
      }
      if (key === pendingKey.current) return

      window.clearTimeout(openTimer.current)
      pendingKey.current = key
      openTimer.current = window.setTimeout(() => {
        pendingKey.current = ''
        shownKey.current = key
        setHover(next)
      }, delay)
    }

    function scheduleHide() {
      window.clearTimeout(openTimer.current)
      pendingKey.current = ''
      if (!shownKey.current || closeTimer.current) return
      closeTimer.current = window.setTimeout(hide, CLOSE_DELAY)
    }

    let frame = 0
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      const { buttons, clientX, clientY } = event
      const own = insideOwnUi(event)
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        if (own) {
          window.clearTimeout(closeTimer.current)
          closeTimer.current = 0
          return
        }
        // 正在拖选文字时不弹，免得挡住选区和翻译按钮
        if (buttons !== 0 || hasSelection()) return
        const hit = hitTest(clientX, clientY)
        if (hit) show(hit, OPEN_DELAY)
        else scheduleHide()
      })
    }

    // 触屏没有悬停，点一下文字同样能打开
    function onClick(event: MouseEvent) {
      if (insideOwnUi(event) || hasSelection()) return
      const hit = hitTest(event.clientX, event.clientY)
      if (hit) show(hit, 0)
      else hide()
    }

    // 卡片按打开时的位置摆放，页面一滚就对不上了
    function onScroll(event: Event) {
      if (!insideOwnUi(event)) hide()
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') hide()
    }

    // 从批注文字上开始拖选时卡片已经弹出来了，不收起会盖住翻译工具条和面板
    function onPointerDown(event: PointerEvent) {
      if (!insideOwnUi(event)) hide()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(openTimer.current)
      pendingKey.current = ''
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [annotations, editor, hide, ranges])

  const closeEditor = useCallback(() => onEditorChange(null), [onEditorChange])

  function edit(annotation: Annotation) {
    const range = ranges.get(annotation.id)
    if (range) onEditorChange({ annotation, id: annotation.id, mode: 'edit', path, range })
  }

  function addNote(annotation: Annotation) {
    const range = ranges.get(annotation.id)
    if (!range) return
    onEditorChange({
      id: `note-for-${annotation.id}`,
      mode: 'create',
      path,
      quote: annotation.quote,
      range,
    })
  }

  function save(note: string) {
    if (!editor) return
    if (editor.mode === 'create') {
      addAnnotation(editor.path, { kind: 'note', note, quote: editor.quote })
    } else {
      updateNote(editor.path, editor.annotation.id, note)
    }
    onEditorChange(null)
  }

  const items = hover ? annotations.filter((annotation) => hover.ids.includes(annotation.id)) : []
  const cardWidth = Math.min(
    items.some((item) => item.kind === 'note') ? 300 : 240,
    window.innerWidth - GAP * 2
  )

  return (
    <>
      {hover &&
        items.length > 0 &&
        createPortal(
          <div
            className="fixed z-50 max-h-[50vh] overflow-y-auto rounded-lg border border-border bg-popover p-3 shadow-lg"
            data-annotate-ui=""
            style={floatingStyle(hover.rect, cardWidth, 160)}
          >
            <AnnotationCard
              items={items}
              onAddNote={addNote}
              onEdit={edit}
              onRemove={(annotation) => removeAnnotation(path, annotation.id)}
            />
          </div>,
          document.body
        )}
      {editor &&
        createPortal(
          <NoteEditor editor={editor} key={editor.id} onClose={closeEditor} onSave={save} />,
          document.body
        )}
    </>
  )
}
