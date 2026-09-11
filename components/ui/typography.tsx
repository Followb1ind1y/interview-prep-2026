import { type PropsWithChildren } from 'react'

export function Typography({ children }: PropsWithChildren) {
  // data-translate-scope：划词翻译只在正文里生效
  return (
    <article className="typography" data-translate-scope="">
      {children}
    </article>
  )
}
