'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { MAX_TEXT_LENGTH } from '@/lib/translate/types'

export interface CapturedSelection {
  /** 选中处所在段落，用来判断词义 */
  context: string
  /** 选中的原文 */
  text: string
  /** 当前文章标题，给模型一个领域锚点 */
  title: string
}

/**
 * 全站默认生效，只排除代码块和显式opt-out的区域。
 * 按钮等纯功能性控件本身就带 `select-none`（见 components/ui/button.tsx），
 * 浏览器原生就选不中，不需要在这里额外处理。
 */
const EXCLUDE = 'pre, [data-no-translate]'
/** 段落级容器：优先用它取上下文，比整个页面更聚焦 */
const BLOCK = 'p,li,td,th,dd,dt,h1,h2,h3,h4,h5,h6,blockquote,figcaption,caption'
/** 导航栏 / 页脚里常见的裸 <a>，不一定包在 BLOCK 里 */
const INLINE = 'a,button,label,summary'
/** 找不到更小容器时的兜底范围 */
const REGION = 'nav,header,footer,aside,section,article,main'
/** 气泡和面板自身，点它们不算「点到别处」 */
const OWN_UI = '[data-translate-ui]'

function pageTitle(): string {
  const heading = document.querySelector('h1')?.textContent?.trim()
  if (heading) return heading
  return document.title.split(' - ')[0]?.trim() ?? ''
}

function capture(): { selection: CapturedSelection; range: Range } | null {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null

  const text = selection.toString().replace(/\s+/g, ' ').trim()
  if (!text || text.length > MAX_TEXT_LENGTH) return null

  const range = selection.getRangeAt(0)
  const node = range.commonAncestorContainer
  const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement
  if (!element) return null

  // 代码块里选中的是标识符，翻译没有意义；也尊重显式的 opt-out 标记
  if (element.closest(EXCLUDE)) return null

  // 上下文容器：段落 → 裸链接/按钮文字 → 页面区块 → 兜底整页
  // 兜底再大也不怕，userPrompt 里的 trimContext 会以选中文字为中心截到 400 字符
  const container =
    element.closest(BLOCK) ?? element.closest(INLINE) ?? element.closest(REGION) ?? document.body
  const context = container.textContent?.replace(/\s+/g, ' ').trim() ?? ''

  return { selection: { text, context, title: pageTitle() }, range: range.cloneRange() }
}

/**
 * 跟踪正文里的划词，并把选区位置换算成视口坐标。
 * 滚动时跟随选区移动，选区消失时自动收起。
 */
export function useTextSelection() {
  const [selection, setSelection] = useState<CapturedSelection | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const rangeRef = useRef<Range | null>(null)

  const clear = useCallback(() => {
    rangeRef.current = null
    setSelection(null)
    setRect(null)
  }, [])

  useEffect(() => {
    function insideOwnUi(target: EventTarget | null) {
      if (!(target instanceof Node)) return false
      const element = target instanceof Element ? target : target.parentElement
      return element?.closest(OWN_UI) != null
    }

    function onPointerDown(event: PointerEvent) {
      if (insideOwnUi(event.target)) return
      clear()
    }

    function refresh(event: Event) {
      if (insideOwnUi(event.target)) return
      const captured = capture()
      if (!captured) {
        clear()
        return
      }
      rangeRef.current = captured.range
      setSelection(captured.selection)
      setRect(captured.range.getBoundingClientRect())
    }

    function onKeyUp(event: KeyboardEvent) {
      // 键盘选词：shift + 方向键
      if (!event.shiftKey) return
      refresh(event)
    }

    // 滚动事件很密，用 rAF 合并，避免每帧都重渲染
    let frame = 0
    function reposition() {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const range = rangeRef.current
        if (!range) return
        setRect(range.getBoundingClientRect())
      })
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('pointerup', refresh)
    document.addEventListener('keyup', onKeyUp)
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerup', refresh)
      document.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [clear])

  return { selection, rect, clear }
}
