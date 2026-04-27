import { cn } from "@/lib/utils"

type ImpactoItem = {
  id: string
  value: string
  label: string
}

type ImpactoSectionProps = {
  items: ImpactoItem[]
}

export function ImpactoSection({ items }: ImpactoSectionProps) {
  return (
    <section
      className={cn("py-20 px-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white")}
      aria-labelledby="impacto-title"
    >
      <div className={cn("max-w-4xl mx-auto text-center")}>
        <h2 id="impacto-title" className={cn("text-3xl font-bold mb-3")}>
          Nosso Impacto
        </h2>
        <p className={cn("text-blue-200 mb-14 max-w-md mx-auto")}>
          Números que mostram a diferença que fazemos juntos.
        </p>
        <div className={cn("flex flex-wrap justify-center divide-x divide-white/20")}>
          {items.map((item) => (
            <div key={item.id} className={cn("flex flex-col items-center gap-2 px-10 py-4")}>
              <span className={cn("text-5xl font-bold text-emerald-400")}>{item.value}</span>
              <span className={cn("text-sm text-blue-200 font-medium")}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
