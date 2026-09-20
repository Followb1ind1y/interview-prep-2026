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
import { usePathname, useRouter } from 'next/navigation'

import { AnnotationLayer } from '@/components/annotate/layer'
import { annotationRoot, describe } from '@/lib/annotate/anchor'
import {
  ANNOTATIONS_SAVED_EVENT,
  addAnnotation,
  editable,
  findSavedTranslation,
  getAnnotations,
  getServerAnnotations,
  migrateLegacyStorage,
  subscribe,
  upsertTranslation,
} from '@/lib/annotate/store'
import { type EditorState, type SavedTranslation } from '@/lib/annotate/types'
import { useI18n } from '@/lib/i18n/provider'

interface AnnotateContextValue {
  /** 浏览器支持 CSS Custom Highlight API，且选区完整落在页面主体里 */
  canAnnotate: (range: Range) => boolean
  findTranslation: (text: string) => SavedTranslation | null
  highlight: (range: Range) => void
  note: (range: Range) => void
  saveTranslation: (range: Range, translation: SavedTranslation) => void
}

const AnnotateContext = createContext<AnnotateContextValue | null>(null)

export function AnnotateProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const getSnapshot = useCallback(() => getAnnotations(pathname), [pathname])
  const annotations = useSyncExternalStore(subscribe, getSnapshot, getServerAnnotations)
  const { locale } = useI18n()
  // 引用必须稳定：layer 按数组引用决定是否重新定位，每次渲染都新建数组会反复重算
  const visible = useMemo(
    () => annotations.filter((item) => !item.locale || item.locale === locale),
    [annotations, locale]
  )

  const [supported, setSupported] = useState(false)
  const [editor, setEditor] = useState<EditorState | null>(null)

  useEffect(() => {
    // 不修改 DOM 就能给任意文字上色靠这个 API；不支持的浏览器整个功能静默关闭
    setSupported(
      typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight === 'function'
    )
  }, [])

  useEffect(() => {
    migrateLegacyStorage()
  }, [])

  useEffect(() => {
    const refreshProgress = () => router.refresh()
    window.addEventListener(ANNOTATIONS_SAVED_EVENT, refreshProgress)
    return () => window.removeEventListener(ANNOTATIONS_SAVED_EVENT, refreshProgress)
  }, [router])

  const canAnnotate = useCallback(
    (range: Range) => {
      // 线上只读：批注只能在本地 next dev 里加，commit 后随部署展示
      if (!supported || !editable) return false
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
      if (quote) addAnnotation(pathname, { kind: 'highlight', locale, quote })
    },
    [locale, pathname]
  )

  const note = useCallback(
    (range: Range) => {
      const root = annotationRoot()
      const quote = root && describe(range, root)
      if (!quote) return
      setEditor({
        id: `new-${Date.now()}`,
        locale,
        mode: 'create',
        path: pathname,
        quote,
        range: range.cloneRange(),
      })
    },
    [locale, pathname]
  )

  const saveTranslation = useCallback(
    (range: Range, translation: SavedTranslation) => {
      const root = annotationRoot()
      const quote = root && describe(range, root)
      if (quote) upsertTranslation(pathname, quote, translation, locale)
    },
    [locale, pathname]
  )

  const findTranslation = useCallback(
    (text: string) => findSavedTranslation(pathname, text),
    [pathname]
  )

  const value = useMemo(
    () => ({ canAnnotate, findTranslation, highlight, note, saveTranslation }),
    [canAnnotate, findTranslation, highlight, note, saveTranslation]
  )

  return (
    <AnnotateContext.Provider value={value}>
      {children}
      {supported && (
        <AnnotationLayer
          annotations={visible}
          // 编辑框绑定的是打开时那一页的选区，换页就不再显示
          editor={editor?.path === pathname ? editor : null}
          locale={locale}
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
