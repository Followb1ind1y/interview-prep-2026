import { LuAlignLeft } from 'react-icons/lu'

import { Logo } from '@/components/navigation/logo'
import { NavMenu } from '@/components/navigation/navbar'
import { PageMenu } from '@/components/sidebar/pagemenu'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'

export function Sidebar() {
  return (
    <aside
      aria-label="Page navigation"
      className="sticky top-26 hidden h-screen w-60 shrink-0 flex-col md:flex"
    >
      <ScrollArea className="h-full" type="scroll">
        <PageMenu />
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex cursor-pointer md:hidden" size="icon" variant="link">
          <LuAlignLeft className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-0 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose asChild>
            <Logo className="flex items-center gap-2.5" />
          </SheetClose>
        </SheetHeader>
        <SheetDescription className="sr-only">Page navigation</SheetDescription>
        <ScrollArea className="min-h-0 flex-1" type="scroll">
          <div className="mx-0 mt-3 flex flex-col gap-2.5 px-5">
            <NavMenu isSheet />
            <Separator className="my-2" />
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
