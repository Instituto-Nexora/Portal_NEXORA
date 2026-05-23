import { cn } from "@/lib/utils";
import { CourseCard } from "./components/course-card";
import { EmptyState } from "./components/empty-state";
import type { CursoComProgresso } from "./types/minha-area.types";

type MinhaAreaViewProps = {
  cursos: CursoComProgresso[];
};

function MinhaAreaView({ cursos }: MinhaAreaViewProps) {
  if (cursos.length === 0) {
    return (
      <div className={cn("container mx-auto py-8")}>
        <div className={cn("mb-8")}>
          <h1 className={cn("text-3xl font-bold text-slate-900")}>
            Meus Cursos
          </h1>
          <p className={cn("text-slate-500")}>
            Continue de onde parou ou inicie uma nova trilha.
          </p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={cn("container mx-auto py-8")}>
      <div className={cn("mb-8")}>
        <h1 className={cn("text-3xl font-bold text-slate-900")}>Meus Cursos</h1>
        <p className={cn("text-slate-500")}>
          Continue de onde parou ou inicie uma nova trilha.
        </p>
      </div>

      <div
        className={cn("grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3")}
      >
        {cursos.map((curso) => (
          <CourseCard key={curso.id} curso={curso} />
        ))}
      </div>
    </div>
  );
}

export { MinhaAreaView };
