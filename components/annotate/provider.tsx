'use client'

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { usePathname } from 'next/navigation'

import { AnnotationLayer } from '@/components/annotate/layer'
import { annotationRoot, describe } from '@/lib/annotate/anchor'
import {
  addAnnotation,
  getAnnotations,
  getServerAnnotations,
  subscribe,
} from '@/lib/annotate/store'
import { type EditorState } from '@/lib/annotate/types'

interface AnnotateContextValue {
  /** 浏览器支持 CSS Custom Highlight API，且选区完整落在页面主体里 */
  canAnnotate: (range: Range) => boolean
  highlight: (range: Range) => void
  note: (range: Range) => void
}

const AnnotateContext = createContext<AnnotateContextValue | null>(null)

export function AnnotateProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const getSnapshot = useCallback(() => getAnnotations(pathname), [pathname])
  const annotations = useSyncExternalStore(subscribe, getSnapshot, getServerAnnotations)

  const [supported, setSupported] = useState(false)
  const [editor, setEditor] = useState<EditorState | null>(null)

  useEffect(() => {
    // 不修改 DOM 就能给任意文字上色靠这个 API；不支持的浏览器整个功能静默关闭
    setSupported(
      typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight === 'function'
    )
  }, [])

  const canAnnotate = useCallback(
    (range: Range) => {
      if (!supported) return false
      const root = annotationRoot()
      if (!root) return false
      return root.contains(range.startContainer) && root.contains(range.endContainer)
    },
    [supported]
  )

  const highlight = useCallback(
    (range: Range) => {
      const root = annotationRoot()
      const quote = root && describe(range, root)
      if (quote) addAnnotation(pathname, { kind: 'highlight', quote })
    },
    [pathname]
  )

  const note = useCallback(
    (range: Range) => {
      const root = annotationRoot()
      const quote = root && describe(range, root)
      if (!quote) return
      setEditor({
        id: `new-${Date.now()}`,
        mode: 'create',
        path: pathname,
        quote,
        range: range.cloneRange(),
      })
    },
    [pathname]
  )

  const value = useMemo(() => ({ canAnnotate, highlight, note }), [canAnnotate, highlight, note])

  return (
    <AnnotateContext.Provider value={value}>
      {children}
      {supported && (
        <AnnotationLayer
          annotations={annotations}
          // 编辑框绑定的是打开时那一页的选区，换页就不再显示
          editor={editor?.path === pathname ? editor : null}
          onEditorChange={setEditor}
          path={pathname}
        />
      )}
    </AnnotateContext.Provider>
  )
}

export function useAnnotate() {
  const ctx = useContext(AnnotateContext)
  if (!ctx) throw new Error('useAnnotate must be used within AnnotateProvider')
  return ctx
}
