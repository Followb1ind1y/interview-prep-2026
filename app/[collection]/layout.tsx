import { type ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { Sidebar } from '@/components/sidebar'
import { isCollectionId } from '@/lib/collections'

export default async function CollectionLayout({
  children,
  params,
}: {
  children: Readonly<ReactNode>
  params: Promise<{ collection: string }>
}) {
  const { collection } = await params
  if (!isCollectionId(collection)) notFound()

  return (
    <div className="flex items-start gap-10 pt-10">
      <Sidebar />
      <div className="flex-1 md:flex-6">{children}</div>
    </div>
  )
}
