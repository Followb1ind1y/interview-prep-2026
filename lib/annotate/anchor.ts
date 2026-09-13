import { type Annotation, type TextQuote } from '@/lib/annotate/types'

/** 前后各存多少字符做消歧 */
const CONTEXT_LENGTH = 32
/** 这些区域里的文字不参与定位 */
const SKIP = 'script, style, noscript, [data-no-annotate]'

interface TextIndex {
  nodes: Text[]
  /** nodes[i] 在拼接文本里的起始偏移 */
  starts: number[]
  text: string
}

/** 只批注页面主体，导航栏、页脚这些每页都一样的地方不存 */
export function annotationRoot(): Element | null {
  return document.querySelector('main')
}

function indexText(root: Element): TextIndex {
  const nodes: Text[] = []
  const starts: number[] = []
  const parts: string[] = []
  let length = 0

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text
    if (!text.data || text.parentElement?.closest(SKIP)) continue
    nodes.push(text)
    starts.push(length)
    parts.push(text.data)
    length += text.data.length
  }

  return { nodes, starts, text: parts.join('') }
}

/** 把 DOM 边界点换算成拼接文本里的偏移 */
function toOffset(index: TextIndex, container: Node, offset: number): number {
  if (container.nodeType === Node.TEXT_NODE) {
    const i = index.nodes.indexOf(container as Text)
    if (i !== -1) return index.starts[i] + offset
  }

  // 边界落在元素上（比如三击选中整段）：第一个结束在边界之后的文本节点就是它
  const point = document.createRange()
  point.setStart(container, offset)
  for (let i = 0; i < index.nodes.length; i++) {
    const node = index.nodes[i]
    if (point.comparePoint(node, node.length) > 0) return index.starts[i]
  }
  return index.text.length
}

export function describe(range: Range, root: Element): TextQuote | null {
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null

  const index = indexText(root)
  let start = toOffset(index, range.startContainer, range.startOffset)
  let end = toOffset(index, range.endContainer, range.endOffset)

  // 双击、三击常把前后空白一起选进来，存进去会让定位对空白变化过于敏感
  while (start < end && /\s/.test(index.text[start])) start++
  while (end > start && /\s/.test(index.text[end - 1])) end--
  if (start >= end) return null

  return {
    exact: index.text.slice(start, end),
    prefix: index.text.slice(Math.max(0, start - CONTEXT_LENGTH), start),
    suffix: index.text.slice(end, end + CONTEXT_LENGTH),
  }
}

function sharedSuffix(a: string, b: string): number {
  let n = 0
  while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++
  return n
}

function sharedPrefix(a: string, b: string): number {
  let n = 0
  while (n < a.length && n < b.length && a[n] === b[n]) n++
  return n
}

/** 所有出现位置里挑前后文最吻合的一处 */
function locate(text: string, quote: TextQuote): number {
  const { exact, prefix, suffix } = quote
  if (!exact) return -1

  const perfect = prefix.length + suffix.length
  let best = -1
  let bestScore = -1

  for (let at = text.indexOf(exact); at !== -1; at = text.indexOf(exact, at + 1)) {
    const end = at + exact.length
    const score =
      sharedSuffix(text.slice(Math.max(0, at - prefix.length), at), prefix) +
      sharedPrefix(text.slice(end, end + suffix.length), suffix)
    if (score > bestScore) {
      best = at
      bestScore = score
    }
    if (score === perfect) break
  }

  return best
}

/** 偏移换回 DOM 位置。结束点落在两个节点交界时留在前一个节点末尾 */
function toPoint(index: TextIndex, offset: number, isEnd: boolean): [Text, number] {
  const { nodes, starts } = index
  let lo = 0
  let hi = nodes.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (isEnd ? starts[mid] < offset : starts[mid] <= offset) lo = mid
    else hi = mid - 1
  }
  return [nodes[lo], offset - starts[lo]]
}

export function resolveAll(root: Element, annotations: Annotation[]): Map<string, Range> {
  const ranges = new Map<string, Range>()
  if (annotations.length === 0) return ranges

  const index = indexText(root)
  if (index.nodes.length === 0) return ranges

  for (const annotation of annotations) {
    const start = locate(index.text, annotation.quote)
    // 原文改了，或者当前语言下这段不显示：先不画，文字回来了会自动恢复
    if (start === -1) continue

    const range = document.createRange()
    range.setStart(...toPoint(index, start, false))
    range.setEnd(...toPoint(index, start + annotation.quote.exact.length, true))
    ranges.set(annotation.id, range)
  }

  return ranges
}
