import { type Locale } from '@/lib/i18n/types'
import { type TranslateDirection, type Translation } from '@/lib/translate/types'

export type AnnotationKind = 'highlight' | 'note'

/** 划词翻译的结果存进批注：之后悬停直接看，再翻译同一段也直接读，不再调接口 */
export interface SavedTranslation extends Translation {
  direction: TranslateDirection
}

/**
 * 靠文字本身定位，而不是 DOM 路径：切语言、客户端跳转、组件结构调整后都能找回来。
 * 同一段文字在页面里出现多次时，用前后文挑出对的那一处。
 */
export interface TextQuote {
  exact: string
  prefix: string
  suffix: string
}

export interface Annotation {
  createdAt: number
  id: string
  kind: AnnotationKind
  /**
   * 在哪种语言界面下创建的，只在同一语言下显示——中英文正文是两份独立内容，批注也各管各的。
   * 缺省表示两种语言都显示：早期没记录语言的数据、或划在两边共用的代码块上。
   */
  locale?: Locale
  /** 自己写的备注，只有 kind === 'note' 才有；存翻译时可以为空 */
  note?: string
  quote: TextQuote
  translation?: SavedTranslation
  updatedAt: number
}

/** 批注编辑框：新建时还没有 Annotation，只有选区 */
export type EditorState =
  | {
      id: string
      locale: Locale
      mode: 'create'
      path: string
      quote: TextQuote
      range: Range
    }
  | {
      annotation: Annotation
      id: string
      mode: 'edit'
      path: string
      range: Range
    }
