import { Menu, UserCircle, LogOut, LayoutDashboard, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/app/actions"

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Cursos", href: "/#cursos" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Eventos", href: "/eventos" },
  { label: "Parceiros", href: "/#parceiros" },
  { label: "Contato", href: "/#contato" },
]

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className={cn("bg-teal-900 text-white px-6 py-3 flex items-center justify-between gap-4 relative z-50")}>
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
        {user ? (
          <div className="relative group pt-4 pb-4 -my-4">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Usuário"}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="size-8 text-amber-500" strokeWidth={1.5} />
              )}
            </button>
            
            <div className="absolute right-0 top-full mt-0 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
              <div className="py-1 flex flex-col">
                <Link 
                  href="/minha-area" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2 transition-colors"
                >
                  <LayoutDashboard className="size-4" />
                  Minha Área
                </Link>
                <Link 
                  href="/perfil" 
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2 transition-colors"
                >
                  <User className="size-4" />
                  Meu Perfil
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <form action={signOut} className="w-full">
                  <button 
                    type="submit" 
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Sair
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
           <Button
             className={cn("bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 h-8 px-4 transition-colors")}
             nativeButton={false}
             render={<Link href="/login" />}
           >
             Entrar
           </Button>
        )}
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
        <SheetContent side="left" className={cn("bg-teal-900 text-white border-r border-teal-700 w-72 p-0 flex flex-col")}>
          <SheetHeader className={cn("border-b border-teal-700 p-5")}>
            <SheetTitle className={cn("text-white text-base text-left")}>Nexora</SheetTitle>
          </SheetHeader>
          
          <nav className={cn("p-4 flex-1 overflow-y-auto")} aria-label="Menu mobile">
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
              
              {user && (
                <>
                  <div className="h-px bg-teal-700 my-2"></div>
                  <li className="px-3 py-2 text-xs font-semibold text-teal-300 uppercase tracking-wider">
                    Minha Conta
                  </li>
                  <li>
                    <SheetClose
                      className={cn("w-full text-left")}
                      render={
                        <Link
                          href="/minha-area"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-amber-500 hover:text-amber-400 hover:bg-white/10 transition-colors",
                          )}
                        />
                      }
                    >
                      <LayoutDashboard className="size-4" />
                      Minha Área
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose
                      className={cn("w-full text-left")}
                      render={
                        <Link
                          href="/perfil"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-amber-500 hover:text-amber-400 hover:bg-white/10 transition-colors",
                          )}
                        />
                      }
                    >
                      <User className="size-4" />
                      Meu Perfil
                    </SheetClose>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          <div className={cn("p-4 border-t border-teal-700 shrink-0")}>
            {user ? (
              <form action={signOut}>
                <Button
                  type="submit"
                  className={cn("w-full bg-red-600 hover:bg-red-700 text-white font-bold border-0 transition-colors flex items-center justify-center gap-2")}
                >
                  <LogOut className="size-4" />
                  Sair da Conta
                </Button>
              </form>
            ) : (
               <Button
                 className={cn("w-full bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 transition-colors")}
                 nativeButton={false}
                 render={<Link href="/login" />}
               >
                 Entrar
               </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
