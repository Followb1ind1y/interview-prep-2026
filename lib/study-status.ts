import { type CollectionId } from '@/lib/collections'
import { getCollectionRoutes } from '@/lib/pageroutes'
import { isRoute, type Paths, type StudyStatus } from '@/lib/paths'

export type StudyProgress = Partial<Record<string, StudyStatus>>
export type StudyLevelProgress = Partial<Record<number, Extract<StudyStatus, 'done'>>>

type StudyRoute = Extract<Paths, { href: string }>

/** Collect every leaf under a route. Missing progress counts as unset (not done). */
function getLeafStatuses(route: StudyRoute, progress: StudyProgress): Array<StudyStatus | undefined> {
  if (!route.items) return [progress[route.href]]

  return route.items
    .filter(isRoute)
    .flatMap((item) => getLeafStatuses({ ...item, href: `${route.href}${item.href}` }, progress))
}

/**
 * Parent sections are done only when every leaf child is done.
 * Any started leaf (doing/done) while others remain unset → doing.
 */
export function getRouteStudyStatus(
  route: StudyRoute,
  progress: StudyProgress
): StudyStatus | undefined {
  if (!route.items) return progress[route.href]

  const leaves = getLeafStatuses(route, progress)
  if (leaves.length === 0) return progress[route.href]
  if (leaves.every((status) => status === 'done')) return 'done'
  if (leaves.some((status) => status === 'doing' || status === 'done')) return 'doing'
  return undefined
}

function findRouteByHref(routes: Paths[], targetHref: string, prefix = ''): StudyRoute | null {
  for (const node of routes) {
    if (!isRoute(node)) continue
    const href = `${prefix}${node.href}`
    if (href === targetHref) return { ...node, href }
    if (node.items && targetHref.startsWith(`${href}/`)) {
      const found = findRouteByHref(node.items, targetHref, href)
      if (found) return found
    }
  }
  return null
}

/** Resolve leaf or aggregated section status for a full path like `/docs/agent/loop`. */
export function resolveStudyStatus(
  href: string,
  progress: StudyProgress,
  collection: CollectionId
): StudyStatus | undefined {
  const route = findRouteByHref(getCollectionRoutes(collection), href, `/${collection}`)
  if (!route) return progress[href]
  return getRouteStudyStatus(route, progress)
}
