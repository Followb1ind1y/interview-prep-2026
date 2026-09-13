'use client'

import { useEffect, useState } from 'react'

/** Range 的视口坐标，滚动和缩放窗口时跟着更新 */
export function useRangeRect(range: Range): DOMRect {
  // 首帧就要有位置，否则浮层挂载时拿不到输入框去聚焦
  const [rect, setRect] = useState(() => range.getBoundingClientRect())

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setRect(range.getBoundingClientRect())
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, true)
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule, true)
      window.removeEventListener('resize', schedule)
    }
  }, [range])

  return rect
}
