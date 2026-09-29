import { type Locale } from '@/lib/i18n/types'

/** Height of the sticky navbar plus a little breathing room. */
const TOP_OFFSET = 80

export interface ScrollAnchor {
  blockIndex: number
  /** Position inside the block as (child index + fraction) / child count. */
  ratio: number
}

function blocks(lang: Locale) {
  return Array.from(document.querySelectorAll<HTMLElement>(`[data-locale-block="${lang}"]`))
}

/** Finds which paired locale block (and where inside it) sits at the top of the viewport. */
export function captureScrollAnchor(lang: Locale): ScrollAnchor | null {
  const list = blocks(lang)
  for (let blockIndex = 0; blockIndex < list.length; blockIndex++) {
    const children = Array.from(list[blockIndex].children) as HTMLElement[]
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect()
      if (rect.bottom > TOP_OFFSET) {
        // Page is above the first block: nothing to anchor.
        if (blockIndex === 0 && i === 0 && rect.top > TOP_OFFSET) return null
        const frac = rect.height > 0 ? Math.min(Math.max((TOP_OFFSET - rect.top) / rect.height, 0), 1) : 0
        return { blockIndex, ratio: (i + frac) / children.length }
      }
    }
  }
  return null
}

/** Scrolls so the matching position in the other language's block lands at the top. */
export function restoreScrollAnchor(lang: Locale, anchor: ScrollAnchor) {
  const block = blocks(lang)[anchor.blockIndex]
  if (!block) return
  const children = Array.from(block.children) as HTMLElement[]
  if (children.length === 0) return
  const pos = anchor.ratio * children.length
  const i = Math.min(Math.floor(pos), children.length - 1)
  const rect = children[i].getBoundingClientRect()
  const y = window.scrollY + rect.top + rect.height * (pos - i) - TOP_OFFSET
  window.scrollTo({ top: Math.max(y, 0), behavior: 'instant' })
}
