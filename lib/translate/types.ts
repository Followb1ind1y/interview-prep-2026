import * as z from 'zod'

/** `en2zh`: 读英文笔记时看不懂 → 译成中文。`zh2en`: 写英文笔记时不会说 → 译成英文。 */
export type TranslateDirection = 'en2zh' | 'zh2en'

export const MAX_TEXT_LENGTH = 1200
/**
 * 上下文只是给模型判断词义用，不需要整段。
 * 实测每多一个 token 都是每次调用都要重发的成本，400 字符足够定位词义。
 */
export const MAX_CONTEXT_LENGTH = 400

/**
 * 结构化返回，前端按字段渲染。
 *
 * 字段刻意只留三个：实测加上 alternatives / terms / example 后，
 * 单次成本从 $0.00098 涨到 $0.0026、延迟从 2.7s 涨到 7s，
 * 而多出来的内容大多是把 primary 换个说法重复一遍。
 *
 * 全部必填：不适用时模型回空字符串，这样 schema 能保持 strict。
 */
export const translationSchema = z.object({
  /** 词 / 短语：本句语境下的释义。句子：整句翻译。 */
  primary: z.string(),
  /** 词性；短语给 phr.，句子留空 */
  pos: z.string(),
  /** 易误解点，没有就留空 */
  note: z.string(),
})

export type Translation = z.infer<typeof translationSchema>

export interface TranslateRequest {
  /** 选中文字所在段落，给模型判断词义用 */
  context?: string
  /** 选中的原文 */
  text: string
  /** 页面标题，给模型一个领域锚点 */
  title?: string
}

export interface TranslateResponse {
  direction: TranslateDirection
  model: string
  result: Translation
}

const CJK = /[\u4e00-\u9fff\u3400-\u4dbf]/

/** 按选中文字本身判断方向：含中文就译成英文，否则译成中文。 */
export function detectDirection(text: string): TranslateDirection {
  return CJK.test(text) ? 'zh2en' : 'en2zh'
}
