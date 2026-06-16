import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      className={cn(
        "min-h-screen bg-background text-foreground",
        "flex items-center justify-center px-4 py-12",
      )}
    >
      <section className={cn("w-full max-w-3xl text-center")}>
        <div
          className={cn(
            "mx-auto grid size-16 place-items-center rounded-lg bg-primary/10 text-primary",
          )}
        >
          <SearchX className={cn("size-8")} aria-hidden="true" />
        </div>

        <p
          className={cn(
            "mt-8 text-sm font-semibold uppercase tracking-widest text-primary",
          )}
        >
          404
        </p>
        <h1
          className={cn(
            "mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl",
          )}
        >
          Página não encontrada
        </h1>
        <p
          className={cn(
            "mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base",
          )}
        >
          O endereço acessado não existe ou foi movido. Você pode voltar para a
          página inicial e continuar navegando pelo Portal NEXORA-TI.
        </p>

        <div
          className={cn(
            "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
          )}
        >
          <Button nativeButton={false} render={<Link href="/" />}>
            <Home className={cn("size-4")} aria-hidden="true" />
            Ir para início
          </Button>
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/eventos" />}
          >
            <ArrowLeft className={cn("size-4")} aria-hidden="true" />
            Ver eventos
          </Button>
        </div>
      </section>
    </main>
  );
}
