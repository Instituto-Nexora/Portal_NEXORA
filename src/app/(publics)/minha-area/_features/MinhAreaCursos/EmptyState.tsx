import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function EmptyState() {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-20 text-center")}>
      <div className={cn("rounded-full bg-teal-50 p-5")}>
        <BookOpen className={cn("size-10 text-teal-600")} aria-hidden="true" />
      </div>
      <div className={cn("max-w-xs")}>
        <h2 className={cn("text-lg font-semibold text-slate-900 mb-1")}>
          Você ainda não tem cursos.
        </h2>
        <p className={cn("text-sm text-slate-500")}>
          Explore os cursos disponíveis e comece sua jornada na tecnologia.
        </p>
      </div>
      <Button
        className={cn("bg-teal-700 hover:bg-teal-600 text-white border-0")}
        nativeButton={false}
        render={<Link href="/vendas" />}
      >
        Ver cursos disponíveis →
      </Button>
    </div>
  )
}
