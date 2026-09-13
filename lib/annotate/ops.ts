import { type Annotation } from '@/lib/annotate/types'

/** 按页面路径分组，也就是 contents/site/annotations.json 的结构 */
export type AnnotationPages = Record<string, Annotation[]>

export type AnnotationPatch = Partial<Pick<Annotation, 'note' | 'translation' | 'updatedAt'>>

/**
 * 发给服务端的是单个操作而不是整页列表：
 * 两个标签页各自保存时，服务端在最新的文件上逐条应用，不会拿旧列表整个覆盖。
 */
export type AnnotationOp =
  | { annotation: Annotation; path: string; type: 'add' }
  | { id: string; patch: AnnotationPatch; path: string; type: 'update' }
  | { id: string; path: string; type: 'remove' }
  /** 按 id 合并，已有的不动：迁移旧的 localStorage 数据、用服务端数据初始化页面都靠它 */
  | { pages: AnnotationPages; type: 'import' }

function withPage(pages: AnnotationPages, path: string, list: Annotation[]): AnnotationPages {
  const next = { ...pages }
  if (list.length > 0) next[path] = list
  else delete next[path]
  return next
}

function mergeById(base: Annotation[], extra: Annotation[]): Annotation[] {
  const ids = new Set(base.map((item) => item.id))
  const added = extra.filter((item) => !ids.has(item.id))
  return added.length > 0 ? [...base, ...added] : base
}

/** 客户端乐观更新和服务端写文件共用这一份逻辑，两边结果才一致 */
export function applyOp(pages: AnnotationPages, op: AnnotationOp): AnnotationPages {
  switch (op.type) {
    case 'add': {
      const list = pages[op.path] ?? []
      if (list.some((item) => item.id === op.annotation.id)) return pages
      return withPage(pages, op.path, [...list, op.annotation])
    }
    case 'update':
      return withPage(
        pages,
        op.path,
        (pages[op.path] ?? []).map((item) => (item.id === op.id ? { ...item, ...op.patch } : item))
      )
    case 'remove':
      return withPage(
        pages,
        op.path,
        (pages[op.path] ?? []).filter((item) => item.id !== op.id)
      )
    case 'import': {
      let next = pages
      for (const [path, list] of Object.entries(op.pages)) {
        const current = next[path] ?? []
        const merged = mergeById(current, list)
        if (merged !== current) next = withPage(next, path, merged)
      }
      return next
    }
  }
}
