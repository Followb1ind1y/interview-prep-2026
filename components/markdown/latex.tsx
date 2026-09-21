import katex from 'katex'

export function Latex({ formula }: { formula: string }) {
  return (
    <div
      className="my-4 overflow-x-auto"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, { displayMode: true, throwOnError: false }),
      }}
    />
  )
}
