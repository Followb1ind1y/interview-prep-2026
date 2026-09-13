import * as z from 'zod'

import { translationSchema } from '@/lib/translate/types'

const pagePath = z.string().startsWith('/').max(500)
const id = z.string().min(1).max(100)

const annotationSchema = z.object({
  createdAt: z.number().int().nonnegative(),
  id,
  kind: z.enum(['highlight', 'note']),
  note: z.string().max(5000).optional(),
  quote: z.object({
    exact: z.string().min(1).max(20_000),
    prefix: z.string().max(200),
    suffix: z.string().max(200),
  }),
  translation: translationSchema.extend({ direction: z.enum(['en2zh', 'zh2en']) }).optional(),
  updatedAt: z.number().int().nonnegative(),
})

/** 写进仓库的东西，字段和长度都卡住，未知字段直接丢掉 */
export const annotationOpSchema = z.discriminatedUnion('type', [
  z.object({ annotation: annotationSchema, path: pagePath, type: z.literal('add') }),
  z.object({
    id,
    patch: annotationSchema.pick({ note: true, translation: true, updatedAt: true }).partial(),
    path: pagePath,
    type: z.literal('update'),
  }),
  z.object({ id, path: pagePath, type: z.literal('remove') }),
  z.object({ pages: z.record(pagePath, z.array(annotationSchema)), type: z.literal('import') }),
])
