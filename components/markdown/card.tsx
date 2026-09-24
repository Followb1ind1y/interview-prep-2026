import { type PropsWithChildren } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { CardStudyStatus } from '@/components/markdown/card-study-status'
import { Link } from '@/lib/transition'
import { iconMap } from '@/settings/icons'

interface CardProps extends PropsWithChildren {
  className?: string
  description?: string
  external?: boolean
  href?: string
  icon?: keyof typeof iconMap
  image?: string
  subtitle?: string
  title: string
  variant?: 'normal' | 'small' | 'image'
}

export function Card({
  subtitle,
  title,
  description,
  href,
  image,
  className,
  external = false,
  icon,
  variant = 'normal',
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null
  const ExternalIcon = iconMap.arrowUpRight

  const content = (
    <div
      className={clsx(
        'group relative flex overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors duration-200 hover:bg-accent/40',
        variant === 'small'
          ? 'items-center gap-2 p-3'
          : variant === 'image'
            ? 'h-full flex-col justify-between p-0'
            : 'h-full flex-col justify-between p-4',
        className
      )}
    >
      {external && href && variant !== 'image' && (
        <div
          className={clsx(
            'absolute top-2 text-muted-foreground transition-transform duration-200 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground',
            variant === 'small' ? 'right-0' : 'right-2'
          )}
        >
          <ExternalIcon className="h-4 w-4" />
        </div>
      )}
      {IconComponent && <IconComponent className="text-muted-foreground" />}
      <div>
        {subtitle && variant === 'normal' && (
          <p className="my-1! text-xs font-semibold text-muted-foreground">{subtitle}</p>
        )}
        {image && variant === 'image' && (
          <Image
            alt={title}
            className="m-0! h-45 w-full rounded-none! border-0 object-cover object-center"
            height={400}
            src={image}
            width={400}
          />
        )}
        <div
          className={clsx(
            'flex items-center gap-2 font-semibold transition-colors duration-200',
            variant === 'small' ? 'text-sm' : variant === 'image' ? 'p-4 text-sm' : 'text-lg',
            className
          )}
        >
          <span>{title}</span>
          <CardStudyStatus href={href} />
        </div>
        {description && variant === 'normal' && (
          <p className="my-2! text-sm font-normal text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  )

  return href ? (
    <Link
      className="no-underline!"
      href={href}
      rel={external ? 'noopener noreferrer' : undefined}
      target={external ? '_blank' : undefined}
    >
      {content}
    </Link>
  ) : (
    content
  )
}

export function CardGrid({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">{children}</div>
}
