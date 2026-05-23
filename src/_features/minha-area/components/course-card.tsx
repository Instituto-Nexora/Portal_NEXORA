import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CursoComProgresso } from "../types/minha-area.types";

type CourseCardProps = {
  curso: CursoComProgresso;
};

function CourseCard({ curso }: CourseCardProps) {
  const isComplete = curso.progressPercent === 100;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm",
      )}
    >
      {curso.thumbnail_url && (
        <Image
          src={curso.thumbnail_url}
          alt={`Thumbnail do curso ${curso.title}`}
          width={400}
          height={160}
          className={cn("h-40 w-full rounded-md object-cover")}
        />
      )}

      <div>
        <h2 className={cn("text-xl font-semibold text-slate-900")}>
          {curso.title}
        </h2>
        <p className={cn("mt-1 text-sm text-slate-500")}>
          {curso.aulasConcluidas} de {curso.totalAulas} aulas concluídas
        </p>
      </div>

      <div className={cn("mt-auto flex flex-col gap-1")}>
        <div className={cn("flex justify-between text-sm")}>
          <span className={cn("font-medium text-slate-700")}>Progresso</span>
          <span className={cn("text-slate-500")}>{curso.progressPercent}%</span>
        </div>
        <div
          className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100")}
        >
          <div
            className={cn(
              "h-full rounded-full",
              isComplete ? "bg-green-500" : "bg-blue-600",
            )}
            style={{ width: `${curso.progressPercent}%` }}
            role="progressbar"
            aria-valuenow={curso.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso do curso: ${curso.progressPercent}%`}
          />
        </div>
      </div>

      <div className={cn("mt-2 border-t pt-4")}>
        <Button
          className={cn("w-full")}
          variant={isComplete ? "outline" : "default"}
          nativeButton={false}
          render={<Link href={`/minha-area/cursos/${curso.id}`} />}
        >
          {isComplete ? "Acessar Curso" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}

export { CourseCard };
