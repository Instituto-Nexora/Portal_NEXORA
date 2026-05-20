import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <section
      className={cn(["space-y-6"])}
      aria-label="Carregando perfil"
      aria-busy="true"
    >
      <div className={cn(["space-y-2"])}>
        <Skeleton className={cn(["h-8 w-48"])} />
        <Skeleton className={cn(["h-4 w-full max-w-lg"])} />
      </div>
      <div className={cn(["grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"])}>
        <Skeleton className={cn(["h-96"])} />
        <Skeleton className={cn(["h-80"])} />
      </div>
    </section>
  );
}
