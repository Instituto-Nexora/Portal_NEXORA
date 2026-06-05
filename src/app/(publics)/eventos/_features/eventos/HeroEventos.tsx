import { cn } from "@/lib/utils";

export function HeroEventos() {
  return (
    <section
      className={cn("bg-teal-900 text-white text-center py-20 px-6")}
      aria-labelledby="eventos-hero-title"
    >
      <div className={cn("max-w-2xl mx-auto flex flex-col items-center gap-4")}>
        <span
          className={cn(
            "text-amber-400 text-xs font-semibold tracking-widest uppercase",
          )}
        >
          Comunidade Nexora
        </span>
        <h1
          id="eventos-hero-title"
          className={cn("text-4xl md:text-5xl font-black leading-tight")}
        >
          Eventos e Lives
        </h1>
        <p className={cn("text-teal-200 text-lg max-w-lg")}>
          Participe das nossas palestras, workshops e transmissões ao vivo.
          Conhecimento gratuito para todos.
        </p>
      </div>
    </section>
  );
}
