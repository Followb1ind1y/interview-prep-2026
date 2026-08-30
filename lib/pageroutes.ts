import { Collections, type CollectionId } from '@/lib/collections'
import { isRoute, type Paths } from '@/lib/paths'
import { type I18nText } from '@/lib/i18n/types'

export type { Paths }

interface Page {
  href: string
  title: I18nText
}

function getAllLinks(node: Paths): Page[] {
  const pages: Page[] = []

  if (isRoute(node) && !node.noLink) {
    pages.push({ title: node.title, href: node.href })
  }

  if (isRoute(node) && node.items) {
    node.items.forEach((subNode) => {
      if (isRoute(subNode)) {
        const temp = { ...subNode, href: `${node.href}${subNode.href}` }
        pages.push(...getAllLinks(temp))
      }
    })
  }

  return pages
}

export function getCollectionRoutes(collection: CollectionId): Paths[] {
  return Collections[collection].routes
}

export function getCollectionPageRoutes(collection: CollectionId): Page[] {
  return Collections[collection].routes.flatMap((it) => getAllLinks(it))
}

export const AllPageRoutes = (Object.keys(Collections) as CollectionId[]).flatMap((collection) =>
  getCollectionPageRoutes(collection).map((page) => ({
    ...page,
    collection,
    href: `/${collection}${page.href}`,
  }))
)

export function getPreviousNext(collection: CollectionId, pathName: string) {
  const pages = getCollectionPageRoutes(collection)
  const index = pages.findIndex((route) => route.href === `/${pathName}`)

  if (index === -1) return { prev: null, next: null }

  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  }
}

