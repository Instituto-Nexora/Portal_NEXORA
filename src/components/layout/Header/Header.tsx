"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/#cursos" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Eventos", href: "/eventos" },
  { label: "Parceiros", href: "/#parceiros" },
  { label: "Contato", href: "/#contato" },
]

export function Header() {
  return (
    <header className={cn("bg-teal-900 text-white px-6 py-3 flex items-center justify-between gap-4")}>
      <Link href="/" aria-label="Ir para a página inicial" className={cn("shrink-0")}>
        <Image
          src="/images/logo.png"
          alt="Logo Nexora"
          width={180}
          height={50}
          priority
          className={cn(" w-auto")}
        />
      </Link>

      <nav className={cn("hidden md:flex items-center gap-1")} aria-label="Menu principal">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium text-teal-100 hover:text-white hover:bg-white/10 transition-colors",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className={cn("hidden md:flex items-center gap-3 shrink-0")}>
        <Button
          className={cn("bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 h-8 px-4 transition-colors")}
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Entrar
        </Button>
      </div>

      <Sheet>
        <SheetTrigger
          className={cn(
            "md:hidden inline-flex items-center justify-center size-9 rounded text-white hover:bg-white/10 transition-colors",
          )}
          aria-label="Abrir menu de navegação"
        >
          <Menu className={cn("size-5")} />
        </SheetTrigger>
        <SheetContent side="left" className={cn("bg-teal-900 text-white border-r border-teal-700 w-72 p-0")}>
          <SheetHeader className={cn("border-b border-teal-700 p-5")}>
            <SheetTitle className={cn("text-white text-base")}>Nexora</SheetTitle>
          </SheetHeader>
          <nav className={cn("p-4")} aria-label="Menu mobile">
            <ul className={cn("flex flex-col gap-1 list-none m-0 p-0")}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <SheetClose
                    className={cn("w-full text-left")}
                    render={
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-3 py-2.5 rounded text-sm font-medium text-teal-100 hover:text-white hover:bg-white/10 transition-colors",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
          <div className={cn("p-4 mt-auto border-t border-teal-700")}>
            <Button
              className={cn("w-full bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 transition-colors")}
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Entrar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
