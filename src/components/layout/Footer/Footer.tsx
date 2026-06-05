import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const footerLinks = [
  { label: "Cursos", href: "/#cursos" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Eventos", href: "/eventos" },
  { label: "Parceiros", href: "/#parceiros" },
  { label: "Contato", href: "/#contato" },
];

export function Footer() {
  return (
    <footer className={cn("bg-teal-900 text-white mt-auto")}>
      <div
        className={cn(
          "max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-8",
        )}
      >
        <div className={cn("flex flex-col gap-2")}>
          <span className={cn("text-lg font-bold text-white")}>Nexora</span>
          <p className={cn("text-teal-300 text-sm max-w-xs leading-relaxed")}>
            Tecnologia que conecta, educa e transforma vidas com impacto social
            real.
          </p>
        </div>
        <nav aria-label="Links do rodapé">
          <ul
            className={cn("flex flex-wrap gap-x-6 gap-y-2 list-none p-0 m-0")}
          >
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm text-teal-300 hover:text-white transition-colors",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Separator className={cn("bg-teal-800")} />
      <div className={cn("max-w-5xl mx-auto px-6 py-4 text-center")}>
        <p className={cn("text-xs text-teal-400")}>
          © 2026 Nexora — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
