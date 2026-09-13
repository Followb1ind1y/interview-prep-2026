import { NextResponse } from 'next/server'

import { mutateAnnotationFile } from '@/lib/annotate/file'
import { annotationOpSchema } from '@/lib/annotate/schema'
import { sameOrigin } from '@/lib/same-origin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function bad(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * 只在 next dev 下可用：把批注改动写进 contents/site/annotations.json，由你 commit 进仓库。
 * 线上直接 404——Vercel 的文件系统写不回仓库，也不能让访客改你的批注。
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return bad('not-found', 404)
  }
  if (!sameOrigin(request)) {
    return bad('forbidden', 403)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return bad('invalid-body', 400)
  }

  const parsed = annotationOpSchema.safeParse(body)
  if (!parsed.success) {
    return bad('invalid-annotation', 400)
  }

  try {
    await mutateAnnotationFile(parsed.data)
  } catch (error) {
    console.error('[annotations] write failed', error)
    return bad('write-failed', 500)
  }

  return NextResponse.json({ ok: true })
}
