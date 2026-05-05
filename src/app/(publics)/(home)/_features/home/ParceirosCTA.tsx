import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ParceirosCTA() {
  return (
    <section
      className={cn(
        "py-28 px-6 bg-teal-900",
        "bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[24px_24px]",
      )}
      id="parceiros"
      aria-labelledby="parceiros-title"
    >
      <div className={cn("max-w-2xl mx-auto text-center flex flex-col items-center gap-6")}>
        <span className={cn("text-amber-400 text-xs font-semibold tracking-widest uppercase")}>
          Impacto Social
        </span>
        <h2 id="parceiros-title" className={cn("text-4xl font-black text-white")}>
          Seja um Parceiro
        </h2>
        <p className={cn("text-teal-200 text-lg leading-relaxed max-w-lg")}>
          Empresas e instituições podem apoiar nossos projetos e transformar vidas com o poder da tecnologia.
        </p>
        <Button
          size="lg"
          className={cn(
            "bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0 h-14 px-10 text-lg mt-2 transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300",
          )}
          render={<Link href="/parceiros" />}
        >
          Quero Apoiar
        </Button>
      </div>
    </section>
  )
}
