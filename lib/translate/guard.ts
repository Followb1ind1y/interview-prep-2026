import { type TranslateResponse } from '@/lib/translate/types'

/**
 * 进程内缓存 + 限流。个人站点单实例够用；
 * 换成多实例部署时这里要换成 Redis 之类的共享存储。
 */

const CACHE_MAX = 500
const cache = new Map<string, TranslateResponse>()

export function cacheKey(direction: string, text: string, context: string): string {
  return `${direction} ${text} ${context.slice(0, 200)}`
}

export function cacheGet(key: string): TranslateResponse | undefined {
  const hit = cache.get(key)
  if (!hit) return undefined
  // 命中后挪到末尾，维持 LRU 顺序
  cache.delete(key)
  cache.set(key, hit)
  return hit
}

export function cacheSet(key: string, value: TranslateResponse) {
  cache.set(key, value)
  if (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
}

const RATE_LIMIT = 40
const RATE_WINDOW_MS = 60_000
const hits = new Map<string, number[]>()

/** 滑动窗口计数，超出返回 false。 */
export function allowRequest(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 1000) {
    for (const [key, stamps] of hits) {
      if (stamps.every((at) => now - at >= RATE_WINDOW_MS)) hits.delete(key)
    }
  }
  return true
}
