import {
  MAX_CONTEXT_LENGTH,
  type TranslateDirection,
  type TranslateRequest,
} from '@/lib/translate/types'

/**
 * 这两段 system prompt 每次调用都要重发，且 Haiku 4.5 的 prompt cache
 * 门槛是 4096 token、这里够不着，所以每一句都要挣得起自己的位置。
 * 改之前先想清楚：多写一行规则 ≈ 每次调用多花一点钱。
 */

const EN2ZH = `
你精通中英文，是 LLM / ML 工程师。用户是中文母语工程师，正在读自己的英文技术笔记准备英文面试，选中了看不懂的部分。

primary：
- 词 / 短语：用一句中文说清它在这句话里的意思。术语给中文通译并在括号里保留英文。
- 句子：准确通顺的中文翻译，术语保留英文原词，不要逐字直译。
pos：词给词性（n./v./adj./adv./prep.），短语给 phr.，句子留空字符串。
note：仅当有易误解点时给一句（近义词差别、搭配陷阱、常见误译），否则空字符串。不要使用引号。

不翻译代码标识符、变量名、API 名、模型名。输出简体中文，不要客套。
`.trim()

const ZH2EN = `
你精通中英文，是 LLM / ML 工程师。用户是中文母语工程师，要把中文笔记转成英文面试里能直接说出口的表达。

primary：地道、专业、面试场合说得出口的英文。不要中式英语和翻译腔。
pos：空字符串。
note：中式英语陷阱，或直译会踩的坑，一句中文；没有就空字符串。不要使用引号。

不翻译代码标识符、变量名、API 名、模型名。
`.trim()

export function systemPrompt(direction: TranslateDirection): string {
  return direction === 'en2zh' ? EN2ZH : ZH2EN
}

/** 上下文太长时以选中文字为中心截取，保证模型看到的是选中处附近。 */
function trimContext(context: string, text: string): string {
  const clean = context.replace(/\s+/g, ' ').trim()
  if (clean.length <= MAX_CONTEXT_LENGTH) return clean

  const at = clean.indexOf(text)
  if (at < 0) return clean.slice(0, MAX_CONTEXT_LENGTH)

  const half = Math.floor((MAX_CONTEXT_LENGTH - text.length) / 2)
  const start = Math.max(0, at - half)
  return clean.slice(start, start + MAX_CONTEXT_LENGTH)
}

export function userPrompt({ text, context, title }: TranslateRequest): string {
  const parts: string[] = []
  if (title) parts.push(`页面主题：${title}`)
  if (context) parts.push(`上下文：${trimContext(context, text)}`)
  parts.push(`选中：${text}`)
  return parts.join('\n\n')
}
