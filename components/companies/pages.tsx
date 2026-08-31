'use client'

import { Mermaid } from '@/components/markdown/mermaid'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import {
  kanbanCharts,
  overviewCopy,
  templateCopy,
} from '@/lib/companies-data'

export function CompaniesOverview() {
  const { locale } = useI18n()
  const columns = overviewCopy.columns[locale]
  const boardTitle = locale === 'zh' ? '看板' : 'Board'

  return (
    <div className="space-y-4">
      <h2 id="board">{boardTitle}</h2>
      <div className="not-prose overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left">
              {columns.map((col) => (
                <th className="px-3 py-2 font-semibold" key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {overviewCopy.rows.map((row) => (
              <tr className="border-b" key={`${row.company}-${row.applied}`}>
                <td className="px-3 py-2">{row.company}</td>
                <td className="px-3 py-2">{row.role}</td>
                <td className="px-3 py-2">{localize(row.status, locale)}</td>
                <td className="px-3 py-2">{row.applied}</td>
                <td className="px-3 py-2">{localize(row.next, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{localize(overviewCopy.statuses, locale)}</p>
    </div>
  )
}

export function CompaniesTemplate() {
  const { locale } = useI18n()
  const copy = templateCopy
  const timelineCols = copy.timelineColumns[locale]

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 id="board-example">{localize(copy.sections.boardExample, locale)}</h2>
        <p>{localize(copy.boardIntro, locale)}</p>
        <Mermaid chart={kanbanCharts[locale]} className="my-4 overflow-x-auto" />
      </section>

      <section className="space-y-3">
        <h2 id="basics">{localize(copy.sections.basics, locale)}</h2>
        <ul>
          {copy.basics[locale].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 id="timeline">{localize(copy.sections.timeline, locale)}</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                {timelineCols.map((col) => (
                  <th className="px-3 py-2 font-semibold" key={col}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.timelineEvents[locale].map((event) => (
                <tr className="border-b" key={event}>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2">{event}</td>
                  <td className="px-3 py-2" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 id="questions">{localize(copy.sections.questions, locale)}</h2>
        <p>{localize(copy.questions, locale)}</p>
      </section>

      <section className="space-y-3">
        <h2 id="retro">{localize(copy.sections.retro, locale)}</h2>
        <ul>
          {copy.retro[locale].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
