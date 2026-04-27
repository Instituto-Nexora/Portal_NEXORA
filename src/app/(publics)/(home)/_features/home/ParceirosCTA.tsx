import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ParceirosCTA() {
  return (
    <section
      className={cn("py-24 px-6 bg-emerald-50")}
      id="parceiros"
      aria-labelledby="parceiros-title"
    >
      <div className={cn("max-w-2xl mx-auto text-center flex flex-col items-center gap-6")}>
        <span className={cn("text-emerald-600 text-sm font-semibold tracking-widest uppercase")}>
          Impacto Social
        </span>
        <h2 id="parceiros-title" className={cn("text-3xl font-bold text-blue-900")}>
          Seja um Parceiro
        </h2>
        <p className={cn("text-gray-600 text-lg leading-relaxed")}>
          Empresas e instituições podem apoiar nossos projetos e transformar vidas com o poder da tecnologia.
        </p>
        <Button
          size="lg"
          className={cn("bg-emerald-500 hover:bg-emerald-600 text-white border-0 h-12 px-8 text-base mt-2")}
          render={<Link href="/parceiros" />}
        >
          Quero Apoiar
        </Button>
      </div>
    </section>
  )
}
