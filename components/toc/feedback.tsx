'use client'

import Link from 'next/link'
import { LuArrowUpRight } from 'react-icons/lu'

import { type CollectionId, Collections } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { GitHubLink } from '@/settings/navigation'

interface FeedbackProps {
  collection: CollectionId
  slug: string
  title: string
}

export function Feedback({ slug, title, collection }: FeedbackProps) {
  const { m } = useI18n()
  const dir = Collections[collection].contentDir
  const feedbackUrl = `${GitHubLink.href}/issues/new?title=Feedback for "${title}"&labels=feedback`
  const editUrl = `${GitHubLink.href}/edit/main/${dir}/${slug}/index.mdx`

  return (
    <div className="flex flex-col gap-3 pl-3">
      <h3 className="text-sm font-semibold">{m.docs.content}</h3>
      <div className="flex flex-col gap-2">
        <Link
          className="flex items-center text-sm text-foreground"
          href={feedbackUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LuArrowUpRight className="mr-1 inline-block h-4 w-4" />
          <span>{m.docs.feedback}</span>
        </Link>
        <Link
          className="flex items-center text-sm text-foreground"
          href={editUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <LuArrowUpRight className="mr-1 inline-block h-4 w-4" />
          <span>{m.docs.edit}</span>
        </Link>
      </div>
    </div>
  )
}
