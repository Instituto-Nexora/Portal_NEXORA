import { CourseCardSkeleton } from "@/_features/minha-area/components/course-card-skeleton";
import { cn } from "@/lib/utils";

export default function MinhaAreaLoading() {
  return (
    <div className={cn("container mx-auto py-8")}>
      <div className={cn("mb-8")}>
        <div className={cn("h-9 w-48 rounded bg-slate-200")} />
        <div className={cn("mt-2 h-5 w-72 rounded bg-slate-100")} />
      </div>

      <div
        className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3")}
      >
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <CourseCardSkeleton key={`skeleton-${id}`} />
        ))}
      </div>
    </div>
  );
}
