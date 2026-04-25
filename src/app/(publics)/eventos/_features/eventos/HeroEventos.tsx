import { cn } from "@/lib/utils"

export function HeroEventos() {
  return (
    <section
      className={cn("bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700 text-white text-center py-20 px-6")}
      aria-labelledby="eventos-hero-title"
    >
      <div className={cn("max-w-2xl mx-auto flex flex-col items-center gap-4")}>
        <span className={cn("text-emerald-300 text-sm font-semibold tracking-widest uppercase")}>
          Comunidade Nexora
        </span>
        <h1 id="eventos-hero-title" className={cn("text-4xl md:text-5xl font-bold leading-tight")}>
          Eventos e Lives
        </h1>
        <p className={cn("text-blue-100 text-lg max-w-lg")}>
          Participe das nossas palestras, workshops e transmissões ao vivo. Conhecimento gratuito para todos.
        </p>
      </div>
    </section>
  )
}
