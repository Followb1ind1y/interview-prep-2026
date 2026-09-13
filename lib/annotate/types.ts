export type AnnotationKind = 'highlight' | 'note'

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
  /** 只有 kind === 'note' 才有 */
  note?: string
  quote: TextQuote
  updatedAt: number
}

/** 批注编辑框：新建时还没有 Annotation，只有选区 */
export type EditorState =
  | {
      id: string
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
