import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function EmptyState() {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-muted/40 p-12 text-center",
      )}
    >
      <h2 className={cn("text-xl font-semibold text-slate-700")}>
        Você ainda não está matriculado em nenhum curso
      </h2>
      <p className={cn("mt-2 text-slate-500")}>
        Explore o catálogo e comece a aprender!
      </p>
      <Button
        className={cn("mt-6")}
        nativeButton={false}
        render={<Link href="/cursos" />}
      >
        Ver Catálogo
      </Button>
    </div>
  );
}

export { EmptyState };
