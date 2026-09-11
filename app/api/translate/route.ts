import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'

import { allowRequest, cacheGet, cacheKey, cacheSet } from '@/lib/translate/guard'
import { systemPrompt, userPrompt } from '@/lib/translate/prompt'
import {
  detectDirection,
  MAX_TEXT_LENGTH,
  type TranslateResponse,
  translationSchema,
} from '@/lib/translate/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// 划词翻译要秒回，所以默认走 Haiku 4.5 且不开 thinking。
// 想换模型改 .env.local 里的 TRANSLATE_MODEL。
const MODEL = process.env.TRANSLATE_MODEL || 'claude-haiku-4-5'

function bad(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * 只接受同源请求，避免这个代理被别人当免费翻译 API 用。
 * 浏览器对 POST 一定会带 Origin，所以这里要求它必须存在且匹配——
 * 只要放过缺失的情况，curl 不带这个头就能绕过去。
 */
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false

  // Vercel 等平台会把原始域名放在 x-forwarded-host
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return bad('missing-api-key', 503)
  }
  if (!sameOrigin(request)) {
    return bad('forbidden', 403)
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (!allowRequest(ip)) {
    return bad('rate-limited', 429)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return bad('invalid-body', 400)
  }

  const { text, context, title } = (body ?? {}) as Record<string, unknown>
  if (typeof text !== 'string') return bad('invalid-body', 400)

  const selected = text.trim()
  if (!selected) return bad('empty-selection', 400)
  if (selected.length > MAX_TEXT_LENGTH) return bad('selection-too-long', 413)

  const paragraph = typeof context === 'string' ? context : ''
  const heading = typeof title === 'string' ? title : ''
  const direction = detectDirection(selected)

  const key = cacheKey(direction, selected, paragraph)
  const cached = cacheGet(key)
  if (cached) return NextResponse.json(cached)

  const client = new Anthropic()

  try {
    const message = await client.messages.parse({
      model: MODEL,
      // 实测输出平均 88 token，800 是防跑飞的上限而不是预期值
      max_tokens: 800,
      system: systemPrompt(direction),
      messages: [
        {
          role: 'user',
          content: userPrompt({ text: selected, context: paragraph, title: heading }),
        },
      ],
      output_config: {
        format: zodOutputFormat(translationSchema),
      },
    })

    const result = message.parsed_output
    if (!result) return bad('unparsable-response', 502)

    const payload: TranslateResponse = { direction, model: message.model, result }
    cacheSet(key, payload)
    return NextResponse.json(payload)
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) return bad('invalid-api-key', 401)
    if (error instanceof Anthropic.RateLimitError) return bad('upstream-rate-limited', 429)
    if (error instanceof Anthropic.APIError) {
      console.error('[translate] API error', error.status, error.message)
      return bad('upstream-error', 502)
    }
    console.error('[translate] unexpected error', error)
    return bad('unexpected-error', 500)
  }
}
