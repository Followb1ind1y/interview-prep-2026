import { type AnnotationOp, type AnnotationPages, applyOp } from '@/lib/annotate/ops'
import {
  type Annotation,
  type AnnotationKind,
  type SavedTranslation,
  type TextQuote,
} from '@/lib/annotate/types'
import { type Locale } from '@/lib/i18n/types'

/**
 * 客户端的批注状态。数据源是仓库里的 contents/site/annotations.json（见 lib/annotate/file.ts）：
 * - 本地 next dev：可以改。先更新界面，再发给 /api/annotations 写文件，由你 commit + push
 * - 线上：只读展示构建时的文件内容
 */
export const editable = process.env.NODE_ENV === 'development'

const ENDPOINT = '/api/annotations'
/** 早期版本存在 localStorage 里，开发时自动搬进文件 */
const LEGACY_STORAGE_KEY = 'followblindly-annotations'
const CHANNEL_NAME = 'followblindly-annotations'
const EMPTY: Annotation[] = []
export const ANNOTATIONS_SAVED_EVENT = 'followblindly-annotations-saved'

let pages: AnnotationPages = {}
/**
 * 已经用服务端数据初始化过的页面。之后以内存为准：
 * 客户端路由缓存里可能是保存之前渲染的旧数据，不能拿它覆盖刚改的内容。
 */
const seeded = new Set<string>()
const listeners = new Set<() => void>()
/** 按顺序发请求，文件里的结果和操作顺序一致 */
let pending: Promise<unknown> = Promise.resolve()
let channel: BroadcastChannel | null = null
let migrated = false

function emit() {
  for (const listener of listeners) listener()
}

function apply(op: AnnotationOp) {
  const next = applyOp(pages, op)
  if (next === pages) return
  pages = next
  emit()
}

async function send(op: AnnotationOp): Promise<boolean> {
  try {
    const response = await fetch(ENDPOINT, {
      body: JSON.stringify(op),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)
    window.dispatchEvent(new Event(ANNOTATIONS_SAVED_EVENT))
    return true
  } catch (error) {
    console.error('[annotate] 没能写进 contents/site/annotations.json，刷新后这次改动会丢失', error)
    return false
  }
}

function commit(op: AnnotationOp) {
  if (!editable) return
  apply(op)
  // 同时开着的其他标签页跟着更新
  channel?.postMessage(op)
  pending = pending.then(() => send(op))
}

export function subscribe(listener: () => void) {
  if (listeners.size === 0 && editable && typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event: MessageEvent<AnnotationOp>) => {
      apply(event.data)
      window.dispatchEvent(new Event(ANNOTATIONS_SAVED_EVENT))
    }
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      channel?.close()
      channel = null
    }
  }
}

export function getAnnotations(path: string): Annotation[] {
  return pages[path] ?? EMPTY
}

export function getServerAnnotations(): Annotation[] {
  return EMPTY
}

/** 页面把服务端读到的批注交进来，每个页面只在第一次打开时生效 */
export function seedAnnotations(path: string, list: Annotation[]) {
  if (seeded.has(path)) return
  seeded.add(path)
  if (list.length > 0) apply({ pages: { [path]: list }, type: 'import' })
}

/** 把早期存在 localStorage 里的批注搬进文件，写成功才删掉旧数据 */
export function migrateLegacyStorage() {
  if (!editable || migrated) return
  migrated = true

  let legacy: unknown
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return
    legacy = JSON.parse(raw)
  } catch {
    return
  }
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return

  const op: AnnotationOp = { pages: legacy as AnnotationPages, type: 'import' }
  apply(op)
  pending = pending.then(async () => {
    if (await send(op)) window.localStorage.removeItem(LEGACY_STORAGE_KEY)
  })
}

function newId(): string {
  // 非安全上下文（比如用局域网 IP 打开 http）没有 randomUUID
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function sameQuote(a: TextQuote, b: TextQuote): boolean {
  return a.exact === b.exact && a.prefix === b.prefix && a.suffix === b.suffix
}

export function addAnnotation(
  path: string,
  input: {
    kind: AnnotationKind
    locale: Locale
    note?: string
    quote: TextQuote
    translation?: SavedTranslation
  }
) {
  const list = getAnnotations(path)
  // 同一语言下同一处重复点高亮不叠加
  if (
    input.kind === 'highlight' &&
    list.some(
      (item) =>
        item.kind === 'highlight' &&
        item.locale === input.locale &&
        sameQuote(item.quote, input.quote)
    )
  ) {
    return
  }

  const now = Date.now()
  commit({
    annotation: { ...input, createdAt: now, id: newId(), updatedAt: now },
    path,
    type: 'add',
  })
}

export function updateNote(path: string, id: string, note: string) {
  commit({ id, patch: { note, updatedAt: Date.now() }, path, type: 'update' })
}

export function removeAnnotation(path: string, id: string) {
  commit({ id, path, type: 'remove' })
}

/** 同一处已经有批注（自己写的或之前存的翻译）就把翻译挂上去，不另起一条 */
export function upsertTranslation(
  path: string,
  quote: TextQuote,
  translation: SavedTranslation,
  locale: Locale
) {
  const existing = getAnnotations(path).find(
    (item) => item.kind === 'note' && item.locale === locale && sameQuote(item.quote, quote)
  )
  if (!existing) {
    addAnnotation(path, { kind: 'note', locale, note: '', quote, translation })
    return
  }
  commit({ id: existing.id, patch: { translation, updatedAt: Date.now() }, path, type: 'update' })
}

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

/**
 * 本页存过的同一段文字的翻译。只查本页：同一个词换个语境释义可能不同。
 * 不区分语言：英文界面存过的术语，在中文界面划同一个词照样直接复用，不花 token。
 */
export function findSavedTranslation(path: string, text: string): SavedTranslation | null {
  const target = normalize(text)
  const found = getAnnotations(path).find(
    (item) => item.translation && normalize(item.quote.exact) === target
  )
  return found?.translation ?? null
}
