import {
  type Annotation,
  type AnnotationKind,
  type SavedTranslation,
  type TextQuote,
} from '@/lib/annotate/types'

/**
 * 高亮和批注只存在浏览器 localStorage 里，按页面路径分组。
 * localhost 和线上域名各存各的；换浏览器或清站点数据就没了——个人用够了，不上服务端。
 */

const STORAGE_KEY = 'followblindly-annotations'
const EMPTY: Annotation[] = []

type Store = Record<string, Annotation[]>

const listeners = new Set<() => void>()
/** useSyncExternalStore 要求快照引用稳定，所以缓存解析结果，只在写入时换新 */
let cache: Store | null = null

function read(): Store {
  if (cache) return cache
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    cache = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Store) : {}
  } catch {
    cache = {}
  }
  return cache
}

function emit() {
  for (const listener of listeners) listener()
}

function write(path: string, next: Annotation[]) {
  const store = { ...read() }
  if (next.length > 0) store[path] = next
  else delete store[path]
  cache = store

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // 隐私模式或配额满：本次打开期间照常可用，只是刷新后丢失
  }
  emit()
}

/** 另一个标签页改了批注，同步过来 */
function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return
  cache = null
  emit()
}

export function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

export function getAnnotations(path: string): Annotation[] {
  return read()[path] ?? EMPTY
}

export function getServerAnnotations(): Annotation[] {
  return EMPTY
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
  input: { kind: AnnotationKind; note?: string; quote: TextQuote; translation?: SavedTranslation }
) {
  const list = getAnnotations(path)
  // 同一处重复点高亮不叠加
  if (
    input.kind === 'highlight' &&
    list.some((item) => item.kind === 'highlight' && sameQuote(item.quote, input.quote))
  ) {
    return
  }

  const now = Date.now()
  write(path, [...list, { ...input, createdAt: now, id: newId(), updatedAt: now }])
}

export function updateNote(path: string, id: string, note: string) {
  write(
    path,
    getAnnotations(path).map((item) =>
      item.id === id ? { ...item, note, updatedAt: Date.now() } : item
    )
  )
}

export function removeAnnotation(path: string, id: string) {
  write(
    path,
    getAnnotations(path).filter((item) => item.id !== id)
  )
}

/** 同一处已经有批注（自己写的或之前存的翻译）就把翻译挂上去，不另起一条 */
export function upsertTranslation(path: string, quote: TextQuote, translation: SavedTranslation) {
  const list = getAnnotations(path)
  const existing = list.find((item) => item.kind === 'note' && sameQuote(item.quote, quote))
  if (!existing) {
    addAnnotation(path, { kind: 'note', note: '', quote, translation })
    return
  }
  write(
    path,
    list.map((item) =>
      item.id === existing.id ? { ...item, translation, updatedAt: Date.now() } : item
    )
  )
}

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

/** 本页存过的同一段文字的翻译。只查本页：同一个词换个语境释义可能不同 */
export function findSavedTranslation(path: string, text: string): SavedTranslation | null {
  const target = normalize(text)
  const found = getAnnotations(path).find(
    (item) => item.translation && normalize(item.quote.exact) === target
  )
  return found?.translation ?? null
}
