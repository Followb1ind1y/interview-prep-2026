'use client'

import { memo, useEffect, useRef } from 'react'

type MermaidApi = typeof import('mermaid').default

interface MermaidProps {
  chart: string
  className?: string
}

const normalizeChart = (input?: string): string => {
  if (!input) return ''

  return input
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line) => line.trim().length > 0)
    .join('\n')
}

let loader: Promise<MermaidApi> | null = null

/**
 * mermaid 有一两 MB，静态 import 会进每个文档页的首屏包，拖慢 hydration（批注高亮也要等 hydration 完才画）。
 * 用到图的时候再加载，只加载一次。
 */
function loadMermaid(): Promise<MermaidApi> {
  loader ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
    })
    return mermaid
  })
  return loader
}

export const Mermaid = memo(({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = ref.current

    if (!current || !chart) return

    const renderChart = async () => {
      const id = `mermaid-${crypto.randomUUID()}`

      try {
        const mermaid = await loadMermaid()
        const { svg } = await mermaid.render(id, normalizeChart(chart))
        current.innerHTML = svg
      } catch (err) {
        current.innerHTML = `<pre style="color:red">Mermaid error: ${
          err instanceof Error ? err.message : String(err)
        }</pre>`
      }
    }

    void renderChart()
  }, [chart])

  return <div className={className} ref={ref} />
})
