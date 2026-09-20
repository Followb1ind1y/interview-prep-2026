import { type ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { Sidebar } from '@/components/sidebar'
import { isCollectionId } from '@/lib/collections'
import { getStudyProgress } from '@/lib/study-progress'

export default async function CollectionLayout({
  children,
  params,
}: {
  children: Readonly<ReactNode>
  params: Promise<{ collection: string }>
}) {
  const { collection } = await params
  if (!isCollectionId(collection)) notFound()

  const progress = await getStudyProgress(collection)

  if (collection === 'resume') {
    return <div className="mx-auto w-full max-w-5xl pt-16 pb-28 sm:pt-24">{children}</div>
  }

  return (
    <div className="flex items-start gap-10 pt-10">
      <Sidebar progress={progress} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
