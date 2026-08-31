import { type I18nText } from '@/lib/i18n/types'

export type CompaniesToc = {
  href: string
  level: number
  text: I18nText
}

export const companiesPageTocs: Record<string, CompaniesToc[]> = {
  overview: [{ href: '#board', level: 2, text: { zh: '看板', en: 'Board' } }],
  template: [
    { href: '#board-example', level: 2, text: { zh: '看板示例', en: 'Board example' } },
    { href: '#basics', level: 2, text: { zh: '基本信息', en: 'Basics' } },
    { href: '#timeline', level: 2, text: { zh: '时间线', en: 'Timeline' } },
    { href: '#questions', level: 2, text: { zh: '面试题', en: 'Interview questions' } },
    { href: '#retro', level: 2, text: { zh: '复盘', en: 'Retro' } },
  ],
}

export const overviewCopy = {
  statuses: {
    zh: '状态：准备中 / 已投 / OA / 电面 / Onsite / Offer / 挂 / 放弃。',
    en: 'Statuses: Preparing / Applied / OA / Phone / Onsite / Offer / Rejected / Withdrawn.',
  } satisfies I18nText,
  columns: {
    zh: ['公司', '角色', '状态', '投递日', '下一轮'] as const,
    en: ['Company', 'Role', 'Status', 'Applied', 'Next'] as const,
  },
  rows: [
    {
      company: '—',
      role: '—',
      status: { zh: '准备中', en: 'Preparing' } satisfies I18nText,
      applied: '2026-08-30',
      next: { zh: '先把简历定稿', en: 'Finalize resume first' } satisfies I18nText,
    },
  ],
}

export const templateCopy = {
  boardIntro: {
    zh: '按状态分列，一眼看到每家公司卡在哪一轮：',
    en: 'Columns by status — see where each company sits at a glance:',
  } satisfies I18nText,
  basics: {
    zh: ['角色：', '地点 / 远程：', '渠道：内推 / 官网 / LinkedIn', 'JD 链接：', '投递日期：'],
    en: ['Role:', 'Location / Remote:', 'Source: Referral / Careers / LinkedIn', 'JD link:', 'Applied on:'],
  },
  timelineColumns: {
    zh: ['日期', '事件', '笔记'] as const,
    en: ['Date', 'Event', 'Notes'] as const,
  },
  timelineEvents: {
    zh: ['投递', 'OA', '电面'],
    en: ['Applied', 'OA', 'Phone'],
  },
  questions: {
    zh: '把原题或回忆版写在这里，并链回笔记页。',
    en: 'Paste the real or recalled questions here, and link back to notes.',
  } satisfies I18nText,
  retro: {
    zh: ['表现好的地方', '卡住的地方', '下次改什么'],
    en: ['What went well', 'Where I got stuck', 'What to change next time'],
  },
  sections: {
    boardExample: { zh: '看板示例', en: 'Board example' } satisfies I18nText,
    basics: { zh: '基本信息', en: 'Basics' } satisfies I18nText,
    timeline: { zh: '时间线', en: 'Timeline' } satisfies I18nText,
    questions: { zh: '面试题', en: 'Interview questions' } satisfies I18nText,
    retro: { zh: '复盘', en: 'Retro' } satisfies I18nText,
  },
}

export const kanbanCharts = {
  zh: `kanban
  preparing[准备中]
    resume[定稿简历]
  applied[已投]
    stripe[Stripe · New Grad SWE]
  oa[OA]
    meta[Meta · EMEA]
  phone[电面]
    openai[OpenAI · Applied AI]
  onsite[Onsite]
  offer[Offer]
  rejected[挂 / 放弃]`,
  en: `kanban
  preparing[Preparing]
    resume[Finalize resume]
  applied[Applied]
    stripe[Stripe · New Grad SWE]
  oa[OA]
    meta[Meta · EMEA]
  phone[Phone screen]
    openai[OpenAI · Applied AI]
  onsite[Onsite]
  offer[Offer]
  rejected[Rejected / Withdrawn]`,
} as const

/** Plain text used by the search index for companies React pages. */
export function companiesSearchText(slug: string, locale: 'zh' | 'en' = 'zh'): string {
  if (slug === 'overview') {
    const cols = overviewCopy.columns[locale].join(' ')
    const rows = overviewCopy.rows
      .map((row) =>
        [row.company, row.role, row.status[locale], row.applied, row.next[locale]].join(' ')
      )
      .join('\n')
    return `${locale === 'zh' ? '看板' : 'Board'}\n${cols}\n${rows}\n${overviewCopy.statuses[locale]}`
  }

  if (slug === 'template') {
    const t = templateCopy
    return [
      t.sections.boardExample[locale],
      t.boardIntro[locale],
      t.sections.basics[locale],
      ...t.basics[locale],
      t.sections.timeline[locale],
      t.timelineColumns[locale].join(' '),
      ...t.timelineEvents[locale],
      t.sections.questions[locale],
      t.questions[locale],
      t.sections.retro[locale],
      ...t.retro[locale],
    ].join('\n')
  }

  return ''
}
