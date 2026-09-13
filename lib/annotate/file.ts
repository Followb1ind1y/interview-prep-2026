import { promises as fs } from 'node:fs'
import path from 'node:path'

import { type AnnotationOp, type AnnotationPages, applyOp } from '@/lib/annotate/ops'
import { type Annotation } from '@/lib/annotate/types'

/**
 * 高亮 / 批注 / 存下的翻译的唯一数据源。
 * next dev 时由 /api/annotations 写入；commit 进仓库后，线上构建时只读。
 * 用 fs 读而不是 import：import 的文件会被开发服务器监视，每保存一条批注页面就刷新一次。
 */
const FILE = path.join(process.cwd(), 'contents', 'site', 'annotations.json')

async function load(): Promise<AnnotationPages> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf-8')) as AnnotationPages
  } catch (error) {
    // 文件不存在就当没有批注；JSON 写坏了要直接报错，别悄悄当成空的
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw error
  }
}

/** 线上文件不会变，构建时 100 多个页面共用一次读取；开发时每次都读最新的 */
let memo: Promise<AnnotationPages> | null = null

function readAnnotationPages(): Promise<AnnotationPages> {
  if (process.env.NODE_ENV !== 'production') return load()
  memo ??= load()
  return memo
}

export async function getPageAnnotations(pagePath: string): Promise<Annotation[]> {
  return (await readAnnotationPages())[pagePath] ?? []
}

/** 固定页面顺序和字段顺序：git diff 只显示真正改了的那几条 */
function serialize(pages: AnnotationPages): string {
  const ordered = Object.fromEntries(
    Object.keys(pages)
      .sort()
      .map((key) => [
        key,
        pages[key].map((item) => ({
          id: item.id,
          kind: item.kind,
          ...(item.locale && { locale: item.locale }),
          quote: { exact: item.quote.exact, prefix: item.quote.prefix, suffix: item.quote.suffix },
          ...(item.note !== undefined && { note: item.note }),
          ...(item.translation && {
            translation: {
              direction: item.translation.direction,
              primary: item.translation.primary,
              pos: item.translation.pos,
              note: item.translation.note,
            },
          }),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      ])
  )
  return `${JSON.stringify(ordered, null, 2)}\n`
}

let queue: Promise<unknown> = Promise.resolve()

/** 串行「读 → 改 → 写」，并先写临时文件再改名：并发请求不会互相覆盖，写到一半也不会留下坏 JSON */
export function mutateAnnotationFile(op: AnnotationOp): Promise<void> {
  const run = queue.then(async () => {
    const next = applyOp(await load(), op)
    const tmp = `${FILE}.${process.pid}.tmp`
    await fs.writeFile(tmp, serialize(next), 'utf-8')
    await fs.rename(tmp, FILE)
  })
  queue = run.catch(() => undefined)
  return run
}
