import { TableAnchor, type TableAnchorProps } from '@/components/toc/anchor'
import { BackToTop } from '@/components/toc/backtotop'
import { Feedback } from '@/components/toc/feedback'
import { type CollectionId } from '@/lib/collections'
import { Settings } from '@/types/settings'

interface TableProps {
  collection: CollectionId
  frontmatter: { title: string }
  pathName: string
  tocs: TableAnchorProps
}

export function TableOfContents({ tocs, pathName, frontmatter, collection }: TableProps) {
  const showFeedback = Settings.feedback && collection !== 'resume'
  const showToc = Settings.toc && collection !== 'resume'

  if (!Settings.rightbar) return null
  if (!showToc && !showFeedback && !Settings.totop) return null

  return (
    <aside
      aria-label="Table of contents"
      className="toc sticky top-26 hidden h-screen min-w-57.5 gap-3 xl:flex xl:flex-col"
    >
      {showToc && <TableAnchor tocs={tocs.tocs} />}
      {showFeedback && (
        <Feedback collection={collection} slug={pathName} title={frontmatter.title} />
      )}
      {Settings.totop && <BackToTop />}
    </aside>
  )
}
