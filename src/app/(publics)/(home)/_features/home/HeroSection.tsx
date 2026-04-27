import Link from "next/link"
import { cn } from "@/lib/utils"

type HeroSectionProps = {
  title: string
  subtitle: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
}

export function HeroSection({ title, subtitle, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section
      className={cn("bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-700 text-white text-center py-28 px-6")}
      aria-labelledby="hero-title"
    >
      <div className={cn("max-w-3xl mx-auto flex flex-col items-center gap-6")}>
        <span className={cn("text-emerald-300 text-sm font-semibold tracking-widest uppercase")}>
          Plataforma Educacional
        </span>
        <h1 id="hero-title" className={cn("text-4xl md:text-5xl font-bold leading-tight")}>
          {title}
        </h1>
        <p className={cn("text-lg text-blue-100 max-w-xl")}>{subtitle}</p>
        <div className={cn("flex flex-wrap gap-3 justify-center mt-2")}>
          <Link
            href={primaryCta.href}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white text-base font-medium h-11 gap-1.5 px-7",
              "hover:bg-emerald-600 transition-colors",
            )}
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white text-base font-medium h-11 gap-1.5 px-7",
              "hover:bg-white/20 hover:text-white transition-colors",
            )}
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
