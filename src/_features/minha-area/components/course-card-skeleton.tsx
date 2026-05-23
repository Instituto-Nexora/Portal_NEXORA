import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function CourseCardSkeleton() {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm",
      )}
    >
      <Skeleton className={cn("h-40 w-full rounded-md")} />

      <div className={cn("flex flex-col gap-2")}>
        <Skeleton className={cn("h-6 w-3/4")} />
        <Skeleton className={cn("h-4 w-1/2")} />
      </div>

      <div className={cn("mt-auto flex flex-col gap-2")}>
        <Skeleton className={cn("h-4 w-full")} />
        <Skeleton className={cn("h-2 w-full rounded-full")} />
      </div>

      <div className={cn("mt-2 border-t pt-4")}>
        <Skeleton className={cn("h-9 w-full rounded-lg")} />
      </div>
    </div>
  );
}

export { CourseCardSkeleton };
