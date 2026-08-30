import { type I18nText } from '@/lib/i18n/types'

export type Paths =
  | {
      heading?: I18nText
      href: string
      items?: Paths[]
      noLink?: true
      title: I18nText
    }
  | {
      spacer: true
    }

export function isRoute(node: Paths): node is Extract<Paths, { href: string; title: I18nText }> {
  return 'title' in node && 'href' in node
}
