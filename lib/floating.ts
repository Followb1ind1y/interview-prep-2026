import { type CSSProperties } from 'react'

export const GAP = 8

/** 浮层默认放在 rect 下方，下面剩余不到 minSpaceBelow 就翻到上方；水平方向夹在视口内 */
export function floatingStyle(rect: DOMRect, width: number, minSpaceBelow: number): CSSProperties {
  const left = Math.min(Math.max(GAP, rect.left), Math.max(GAP, window.innerWidth - width - GAP))
  const spaceBelow = window.innerHeight - rect.bottom

  if (spaceBelow >= minSpaceBelow) {
    return { left, top: rect.bottom + GAP, width }
  }
  return { left, bottom: window.innerHeight - rect.top + GAP, width }
}
