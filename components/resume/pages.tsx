'use client'

import { type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { LuArrowRight, LuDownload } from 'react-icons/lu'

import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n/provider'
import { localize, type I18nText } from '@/lib/i18n/types'
import { Link } from '@/lib/transition'
import {
  RESUME_PDF_FILENAME,
  RESUME_PDF_HREF,
  resumeEducation,
  resumeExperience,
  resumeLabels,
  resumeProfile,
  type ResumeExperience,
} from '@/lib/resume-data'
import { cn } from '@/lib/utils'

function DownloadButton() {
  const { locale } = useI18n()

  return (
    <a
      className={cn(buttonVariants({ size: 'lg', variant: 'outline', className: 'px-3.5' }), 'gap-2')}
      download={RESUME_PDF_FILENAME}
      href={RESUME_PDF_HREF}
    >
      <LuDownload className="size-3.5" />
      {resumeLabels[locale].download}
    </a>
  )
}

function ResumeTabs() {
  const pathname = usePathname()
  const { locale } = useI18n()
  const labels = resumeLabels[locale]

  const items = [
    { href: '/resume/about', label: labels.profile },
    { href: '/resume/cv', label: labels.resume },
  ]

  return (
    <nav className="mt-14 flex gap-10 border-b">
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            className={cn(
              'relative -mb-px pb-3.5 text-sm no-underline transition-colors',
              active
                ? 'border-b-2 border-foreground font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function ProfileHeader() {
  const { locale } = useI18n()

  return (
    <header>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
            {resumeProfile.pronouns}
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            {localize(resumeProfile.name, locale)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {localize(resumeProfile.headline, locale)}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {localize(resumeProfile.location, locale)}
            <span className="mx-2.5 text-border">/</span>
            <a
              className="text-muted-foreground no-underline hover:text-foreground"
              href={resumeProfile.github.href}
              rel="noreferrer"
              target="_blank"
            >
              {resumeProfile.github.label}
            </a>
          </p>
        </div>
        <DownloadButton />
      </div>
      <ResumeTabs />
    </header>
  )
}

function Section({
  action,
  children,
  divider = true,
  title,
}: {
  action?: ReactNode
  children: ReactNode
  divider?: boolean
  title: string
}) {
  return (
    <section
      className={cn(
        'grid items-start gap-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-x-12',
        divider ? 'mt-16 border-t pt-16' : 'mt-12'
      )}
    >
      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
      <div>
        {children}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </section>
  )
}

function Meta({ job }: { job: ResumeExperience }) {
  const { locale } = useI18n()
  const parts = [localize(job.company, locale), localize(job.location, locale)]
  if (job.mode) parts.push(localize(job.mode, locale))
  return <p className="mt-1.5 text-sm text-muted-foreground">{parts.join('  ·  ')}</p>
}

function BulletList({ items }: { items: I18nText[] }) {
  const { locale } = useI18n()

  return (
    <ul className="mt-6 space-y-3 text-[15px] leading-7 text-foreground/70">
      {items.map((item) => (
        <li className="flex gap-3" key={localize(item, locale)}>
          <span className="mt-[11px] size-1 shrink-0 rounded-full bg-foreground/30" />
          <span>{localize(item, locale)}</span>
        </li>
      ))}
    </ul>
  )
}

function ExperienceItem({ compact, job }: { compact?: boolean; job: ResumeExperience }) {
  const { locale } = useI18n()

  return (
    <article className="border-b border-border/70 py-12 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="text-lg font-medium tracking-tight">{localize(job.role, locale)}</h3>
        <p className="text-sm text-muted-foreground">{localize(job.period, locale)}</p>
      </div>
      <Meta job={job} />
      {job.summary && (
        <p className="mt-5 text-[15px] leading-7 text-foreground/70">
          {localize(job.summary, locale)}
        </p>
      )}
      {!compact && job.bullets.length > 0 && <BulletList items={job.bullets} />}
      {!compact &&
        job.projects?.map((project) => (
          <div className="mt-10" key={localize(project.name, locale)}>
            <h4 className="text-[15px] font-medium tracking-tight">
              {localize(project.name, locale)}
            </h4>
            <BulletList items={project.bullets} />
          </div>
        ))}
    </article>
  )
}

function EducationList() {
  const { locale } = useI18n()

  return (
    <div>
      {resumeEducation.map((edu) => (
        <article
          className="border-b border-border/70 py-12 first:pt-0 last:border-b-0 last:pb-0"
          key={localize(edu.school, locale)}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h3 className="text-lg font-medium tracking-tight">{localize(edu.school, locale)}</h3>
            <p className="text-sm text-muted-foreground">{localize(edu.period, locale)}</p>
          </div>
          <BulletList items={edu.notes} />
        </article>
      ))}
    </div>
  )
}

function Skills() {
  const { locale } = useI18n()

  return (
    <div className="space-y-8">
      {resumeProfile.skillGroups.map((group) => (
        <div
          className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-baseline sm:gap-12"
          key={localize(group.label, locale)}
        >
          <p className="text-sm text-muted-foreground">{localize(group.label, locale)}</p>
          <p className="text-[15px] leading-7 text-foreground/80">{group.items.join('  ·  ')}</p>
        </div>
      ))}
    </div>
  )
}

export function ResumeAbout() {
  const { locale } = useI18n()
  const labels = resumeLabels[locale]
  const paragraphs = localize(resumeProfile.about, locale).split('\n\n')

  return (
    <div className="not-prose">
      <ProfileHeader />

      <section className="mt-12 grid items-start gap-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-x-12">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{labels.about}</h2>
        <div className="space-y-6">
          {paragraphs.map((paragraph) => (
            <p className="text-[16px] leading-8 text-foreground/80" key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <Section
        action={
          <Link
            className="inline-flex items-center gap-1 text-sm text-muted-foreground no-underline hover:text-foreground"
            href="/resume/cv"
          >
            {labels.viewFull}
            <LuArrowRight className="size-3.5" />
          </Link>
        }
        title={labels.experience}
      >
        {resumeExperience.slice(0, 1).map((job) => (
          <ExperienceItem
            job={job}
            key={localize(job.company, locale) + localize(job.role, locale)}
          />
        ))}
      </Section>

      <Section title={labels.education}>
        <EducationList />
      </Section>
    </div>
  )
}

export function ResumeCV() {
  const { locale } = useI18n()
  const labels = resumeLabels[locale]

  return (
    <div className="not-prose">
      <ProfileHeader />

      <Section divider={false} title={labels.experience}>
        {resumeExperience.map((job) => (
          <ExperienceItem
            job={job}
            key={localize(job.company, locale) + localize(job.role, locale)}
          />
        ))}
      </Section>

      <Section title={labels.education}>
        <EducationList />
      </Section>

      <Section title={labels.skills}>
        <Skills />
      </Section>
    </div>
  )
}
