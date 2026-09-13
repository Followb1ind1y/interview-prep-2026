import { notFound } from 'next/navigation'

import { AnnotationSeed } from '@/components/annotate/seed'
import { ArticleBreadcrumb } from '@/components/article/breadcrumb'
import { DocumentHeading } from '@/components/article/heading'
import { Pagination } from '@/components/article/pagination'
import { TableOfContents } from '@/components/toc'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { getPageAnnotations } from '@/lib/annotate/file'
import { isCollectionId } from '@/lib/collections'
import { companiesPageTocs } from '@/lib/companies-data'
import { getDocument } from '@/lib/markdown'
import { AllPageRoutes } from '@/lib/pageroutes'
import { Settings } from '@/types/settings'

interface PageProps {
  params: Promise<{ collection: string; slug?: string[] }>
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection, slug = [] } = await params
  if (!isCollectionId(collection)) notFound()

  const pathName = slug.join('/')
  const [res, annotations] = await Promise.all([
    getDocument(collection, pathName),
    getPageAnnotations(`/${[collection, ...slug].join('/')}`),
  ])
  if (!res) notFound()

  const { frontmatter, content } = res
  const isProfile = collection === 'resume'
  const tocs =
    collection === 'companies' && companiesPageTocs[pathName]
      ? companiesPageTocs[pathName]
      : res.tocs
  const seed = (
    <AnnotationSeed annotations={annotations} path={`/${[collection, ...slug].join('/')}`} />
  )

  if (isProfile) {
    return (
      <>
        {content}
        {seed}
      </>
    )
  }

  return (
    <div className="flex items-start gap-10">
      {seed}
      <section className="min-w-0 flex-1">
        <ArticleBreadcrumb collection={collection} paths={slug} />
        <div>
          <DocumentHeading
            date={frontmatter.date}
            description={frontmatter.description}
            descriptionEn={frontmatter.descriptionEn}
            keywords={frontmatter.keywords}
            title={frontmatter.title}
            titleEn={frontmatter.titleEn}
          />
          <Separator className="mt-6" />
        </div>
        <Typography>
          <section>{content}</section>
          <Pagination collection={collection} pathname={pathName} />
        </Typography>
      </section>
      <TableOfContents
        collection={collection}
        frontmatter={frontmatter}
        pathName={pathName}
        tocs={{ tocs }}
      />
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { collection, slug = [] } = await params
  if (!isCollectionId(collection)) return null

  const pathName = slug.join('/')
  const res = await getDocument(collection, pathName)
  if (!res) return null

  const { frontmatter, lastUpdated } = res

  return {
    title: `${frontmatter.title} - ${Settings.title}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    ...(lastUpdated && {
      lastModified: new Date(lastUpdated).toISOString(),
    }),
    openGraph: {
      title: `${frontmatter.title} - ${Settings.openGraph.title}`,
      description: frontmatter.description || Settings.openGraph.description,
      url: `${Settings.metadataBase}/${collection}/${pathName}`,
      siteName: Settings.openGraph.siteName,
      type: 'article',
      images: Settings.openGraph.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    twitter: {
      title: `${frontmatter.title} - ${Settings.twitter.title}`,
      description: frontmatter.description || Settings.twitter.description,
      card: Settings.twitter.card,
      site: Settings.twitter.site,
      images: Settings.twitter.images.map((image) => ({
        ...image,
        url: `${Settings.metadataBase}${image.url}`,
      })),
    },
    alternates: {
      canonical: `${Settings.metadataBase}/${collection}/${pathName}`,
    },
  }
}

export function generateStaticParams() {
  return AllPageRoutes.filter((item) => item.href).map((item) => {
    const parts = item.href.split('/').filter(Boolean)
    return {
      collection: parts[0],
      slug: parts.slice(1),
    }
  })
}
