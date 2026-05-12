import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center bg-background px-4",
      )}
    >
      <section
        className={cn(
          "w-full max-w-3xl rounded-lg border bg-card p-6 shadow-sm sm:p-8",
        )}
        aria-label="Carregando conteúdo"
      >
        <div className={cn("flex items-center gap-3")}>
          <div
            className={cn(
              "grid size-10 place-items-center rounded-lg bg-primary/10",
            )}
          >
            <div
              className={cn(
                "size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
              )}
            />
          </div>
          <div className={cn("space-y-2")}>
            <p className={cn("text-sm font-medium")}>Carregando</p>
            <p className={cn("text-xs text-muted-foreground")}>
              Preparando os dados do Portal Nexora.
            </p>
          </div>
        </div>

        <div className={cn("mt-8 grid gap-4 sm:grid-cols-3")}>
          <Skeleton className={cn("h-28")} />
          <Skeleton className={cn("h-28")} />
          <Skeleton className={cn("h-28")} />
        </div>
        <div className={cn("mt-5 space-y-3")}>
          <Skeleton className={cn("h-4 w-full")} />
          <Skeleton className={cn("h-4 w-10/12")} />
          <Skeleton className={cn("h-4 w-7/12")} />
        </div>
      </section>
    </main>
  );
}
