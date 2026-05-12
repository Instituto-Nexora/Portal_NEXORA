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
      className={cn("py-16 px-6 bg-teal-50")}
      aria-labelledby="impacto-title"
    >
      <div className={cn("max-w-4xl mx-auto text-center")}>
        <h2 id="impacto-title" className={cn("text-3xl font-bold text-slate-900 mb-2")}>
          Nosso Impacto em Números
        </h2>
        <p className={cn("text-slate-500 mb-12 max-w-md mx-auto")}>
          Resultados concretos de quem transforma vidas com tecnologia.
        </p>
        <div className={cn("flex flex-wrap justify-center divide-x divide-teal-200")}>
          {items.map((item) => (
            <div key={item.id} className={cn("flex flex-col items-center gap-2 px-12 py-4")}>
              <span className={cn("text-6xl font-black text-teal-700")}>{item.value}</span>
              <span className={cn("text-sm text-slate-600 font-medium")}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
