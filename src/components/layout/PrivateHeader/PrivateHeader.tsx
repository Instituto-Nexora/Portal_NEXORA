"use client";

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PrivateSidebarNav } from "@/components/layout/PrivateSidebar/PrivateSidebarNav"
import { PrivateSidebarUserMenu } from "@/components/layout/PrivateSidebar/PrivateSidebarUserMenu"
import type { SessionUser } from "@/lib/supabase/types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type Props = {
  user: SessionUser;
}

export function PrivateHeader({ user }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu lateral automaticamente ao navegar para outra rota
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={cn("flex h-14 shrink-0 items-center border-b bg-background px-6")}>
      {/* Menu Hamburger - Visível apenas no Mobile */}
      <div className="md:hidden flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="mr-4 focus:outline-none">
            <Menu className="size-6 text-foreground" />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 flex flex-col w-72 bg-background border-r border-border">
            <div className={cn("flex h-14 items-center px-5")}>
              <Link href="/minha-area" onClick={() => setOpen(false)}>
                <p className="text-xl font-bold tracking-widest text-foreground">NEXORA TI</p>
              </Link>
            </div>
            
            <Separator />
            
            <div className={cn("flex-1 overflow-y-auto py-4")}>
              <PrivateSidebarNav />
            </div>
            
            <Separator />
            
            <div className={cn("py-4")}>
              <PrivateSidebarUserMenu user={user} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Espaço vazio no desktop apenas para manter a barra superior limpa */}
    </header>
  )
}
