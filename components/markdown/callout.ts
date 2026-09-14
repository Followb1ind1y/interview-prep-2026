import { type IconType } from 'react-icons'
import {
  LuInfo,
  LuLightbulb,
  LuMessageCircleQuestion,
  LuOctagonAlert,
  LuTriangleAlert,
} from 'react-icons/lu'

/**
 * One color rule for every callout in the notes, so the color alone tells you what a box is:
 *
 * | kind     | color  | what goes in it                                                        |
 * | -------- | ------ | ---------------------------------------------------------------------- |
 * | note     | gray   | supplementary context, term distinctions, background — optional reading |
 * | tip      | green  | connections and interview wins — links to other mechanisms or classic behaviors, points worth raising unprompted |
 * | warning  | orange | pitfalls — easy to misunderstand, likely follow-up questions            |
 * | danger   | red    | wrong claims — saying this in an interview costs you                    |
 * | question | blue   | the learner's own questions and their answers (<MyQuestion>)            |
 */
export type CalloutKind = 'note' | 'tip' | 'warning' | 'danger' | 'question'

/** Vertical margin keeps adjacent callouts visibly separate instead of stacked flush. */
export const CALLOUT_BOX = 'my-8 rounded-md border border-l-4 px-4 text-sm tracking-wide'

export const CALLOUT: Record<
  CalloutKind,
  { accent: string; box: string; divider: string; icon: IconType; title: string }
> = {
  note: {
    accent: 'text-neutral-500 dark:text-neutral-400',
    box: 'border-neutral-200 border-l-neutral-400 bg-neutral-50 dark:border-neutral-800 dark:border-l-neutral-500 dark:bg-neutral-900/60',
    divider: 'border-neutral-200 dark:border-neutral-800',
    icon: LuInfo,
    title: 'text-neutral-900 dark:text-neutral-100',
  },
  tip: {
    accent: 'text-emerald-600 dark:text-emerald-400',
    box: 'border-emerald-200 border-l-emerald-500 bg-emerald-50 dark:border-emerald-900 dark:border-l-emerald-500 dark:bg-emerald-950/40',
    divider: 'border-emerald-200 dark:border-emerald-900',
    icon: LuLightbulb,
    title: 'text-emerald-900 dark:text-emerald-200',
  },
  warning: {
    accent: 'text-orange-600 dark:text-orange-400',
    box: 'border-orange-200 border-l-orange-500 bg-orange-50 dark:border-orange-900 dark:border-l-orange-500 dark:bg-orange-950/40',
    divider: 'border-orange-200 dark:border-orange-900',
    icon: LuTriangleAlert,
    title: 'text-orange-900 dark:text-orange-200',
  },
  danger: {
    accent: 'text-red-600 dark:text-red-400',
    box: 'border-red-200 border-l-red-500 bg-red-50 dark:border-red-900 dark:border-l-red-500 dark:bg-red-950/40',
    divider: 'border-red-200 dark:border-red-900',
    icon: LuOctagonAlert,
    title: 'text-red-900 dark:text-red-200',
  },
  question: {
    accent: 'text-blue-600 dark:text-blue-400',
    box: 'border-blue-200 border-l-blue-500 bg-blue-50 dark:border-blue-900 dark:border-l-blue-400 dark:bg-blue-950/40',
    divider: 'border-blue-200 dark:border-blue-900',
    icon: LuMessageCircleQuestion,
    title: 'text-blue-950 dark:text-blue-100',
  },
}
