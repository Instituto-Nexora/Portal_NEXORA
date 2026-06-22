import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function MinhaAreaLoading() {
  return (
    <main className={cn("max-w-5xl mx-auto px-6 py-12")}>
      <div className={cn("mb-10")}>
        <Skeleton className={cn("h-8 w-44 mb-2")} />
        <Skeleton className={cn("h-4 w-56")} />
      </div>

      <ul
        className={cn(
          "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0",
        )}
        aria-busy="true"
        aria-label="Carregando cursos"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className={cn("rounded-xl overflow-hidden border border-slate-200")}
          >
            <Skeleton className={cn("h-44 w-full rounded-none")} />
            <div className={cn("p-4 flex flex-col gap-3")}>
              <Skeleton className={cn("h-5 w-3/4")} />
              <Skeleton className={cn("h-2 w-full")} />
              <Skeleton className={cn("h-4 w-1/3")} />
              <Skeleton className={cn("h-9 w-full mt-1")} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
