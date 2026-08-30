'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { LuFileText, LuSearch } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collections, COLLECTION_IDS } from '@/lib/collections'
import { useI18n } from '@/lib/i18n/provider'
import { localize } from '@/lib/i18n/types'
import { isRoute } from '@/lib/paths'
import { isSearchReady, searchDocuments, type SearchHit } from '@/lib/search'
import { type SearchDocument } from '@/lib/search-types'
import { cn, highlight } from '@/lib/utils'
import searchJson from '@/public/search-data/documents.json'

export function Search() {
  const { locale, m } = useI18n()
  const [searchedInput, setSearchedInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState<SearchDocument[]>(() => searchJson as SearchDocument[])
  const [results, setResults] = useState<SearchHit[]>([])

  useEffect(() => {
    fetch('/api/search')
      .then((res) => res.json())
      .then((data: SearchDocument[]) => {
        if (Array.isArray(data) && data.length) setIndex(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isSearchReady(searchedInput)) {
      setResults([])
      return
    }

    if (!index.length) return

    setIsLoading(true)
    const timer = window.setTimeout(() => {
      setResults(searchDocuments(searchedInput.trim(), index))
      setIsLoading(false)
    }, 150)

    return () => window.clearTimeout(timer)
  }, [searchedInput, index])

  function renderDocuments(): ReactNode[] {
    return COLLECTION_IDS.flatMap((id) => {
      const collection = Collections[id]
      return collection.routes.flatMap((doc) => {
        if (!isRoute(doc) || doc.noLink) return []
        const href = `/${id}${doc.href}`
        return [
          <DialogClose asChild key={href}>
            <Anchor
              className="flex w-full items-center gap-2.5 rounded-sm px-3 text-[15px] transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              href={href}
            >
              <div className="flex h-full w-fit items-center gap-1.5 py-3 whitespace-nowrap">
                <LuFileText className="h-[1.1rem] w-[1.1rem]" />
                {localize(doc.title, locale)}
              </div>
            </Anchor>
          </DialogClose>,
        ]
      })
    })
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setTimeout(() => setSearchedInput(''), 200)
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        <div className="relative max-w-md flex-1 cursor-pointer">
          <LuSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
          <Input
            className="h-9 w-36 rounded-md border bg-background pr-4 pl-10 text-sm shadow sm:w-48 md:w-56"
            placeholder={m.nav.search}
            readOnly
            type="search"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="top-[45%] max-w-xs p-0 sm:top-[38%] sm:max-w-lg">
        <DialogTitle className="sr-only">{m.nav.search}</DialogTitle>
        <DialogHeader>
          <input
            autoFocus
            className="h-14 border-b bg-transparent px-4 text-[15px] outline-none"
            onChange={(e) => setSearchedInput(e.target.value)}
            placeholder={m.nav.searchPlaceholder}
            value={searchedInput}
          />
        </DialogHeader>

        {searchedInput.length > 0 && !isSearchReady(searchedInput) && (
          <p className="mx-auto mt-2 text-sm text-muted-foreground">{m.nav.searchHint}</p>
        )}

        {isLoading ? (
          <p className="mx-auto mt-2 text-sm text-muted-foreground">{m.nav.searching}</p>
        ) : (
          results.length === 0 &&
          isSearchReady(searchedInput) && (
            <p className="mx-auto mt-2 text-sm text-muted-foreground">
              {m.nav.searchEmpty} <span className="text-primary">{`"${searchedInput}"`}</span>
            </p>
          )
        )}

        <ScrollArea className="max-h-87.5 w-full overflow-hidden">
          <div className="flex w-full flex-col items-start px-1 pt-1 pb-4 sm:px-3">
            {searchedInput
              ? results.map((item) => (
                  <DialogClose asChild key={item.href}>
                    <Anchor
                      className={cn(
                        'flex w-full max-w-77.5 flex-col gap-0.5 rounded-sm p-3 text-[15px] transition-all duration-300 hover:bg-neutral-100 sm:max-w-120 dark:hover:bg-neutral-900'
                      )}
                      href={item.href}
                    >
                      <div className="flex h-full items-center gap-x-2">
                        <LuFileText className="h-[1.1rem] w-[1.1rem]" />
                        <span className="truncate">
                          {locale === 'en' && item.titleEn ? item.titleEn : item.title}
                        </span>
                      </div>
                      {item.snippet && (
                        <p
                          className="truncate text-xs text-neutral-500 dark:text-neutral-400"
                          dangerouslySetInnerHTML={{
                            __html: highlight(item.snippet, searchedInput),
                          }}
                        />
                      )}
                    </Anchor>
                  </DialogClose>
                ))
              : renderDocuments()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
