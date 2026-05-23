import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ cursoId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cursoId } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("courses")
    .select("title")
    .eq("id", cursoId)
    .single();

  return {
    title: data ? `${data.title} — NEXORA` : "Curso — NEXORA",
  };
}

type AulaComProgresso = Lesson & {
  concluida: boolean;
};

export default async function CursoDetailPage({ params }: PageProps) {
  const { cursoId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", cursoId)
    .maybeSingle();

  if (enrollError) {
    throw enrollError;
  }

  if (!enrollment) {
    redirect("/vendas");
  }

  const { data: curso, error: cursoError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", cursoId)
    .single();

  if (cursoError) {
    throw cursoError;
  }

  if (!curso) {
    notFound();
  }

  const { data: aulas, error: aulasError } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", cursoId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (aulasError) {
    throw aulasError;
  }

  const aulasList = aulas ?? [];

  const { data: progress, error: progressError } =
    aulasList.length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, completed_at")
          .eq("user_id", user.id)
          .in(
            "lesson_id",
            aulasList.map((a) => a.id),
          )
      : { data: [], error: null };

  if (progressError) {
    throw progressError;
  }

  const progressMap = new Map(
    progress?.map((p) => [p.lesson_id, p.completed_at !== null]) ?? [],
  );

  const aulasComProgresso: AulaComProgresso[] = aulasList.map((aula) => ({
    ...aula,
    concluida: progressMap.get(aula.id) ?? false,
  }));

  const totalAulas = aulasComProgresso.length;
  const aulasConcluidas = aulasComProgresso.filter((a) => a.concluida).length;
  const percentual =
    totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

  return (
    <div className={cn("container mx-auto py-8")}>
      <Link
        href="/minha-area"
        className={cn(
          "mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700",
        )}
      >
        &larr; Voltar para Meus Cursos
      </Link>

      <div className={cn("mb-8 rounded-lg border bg-white p-6 shadow-sm")}>
        <div
          className={cn(
            "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
          )}
        >
          <div>
            <h1 className={cn("text-2xl font-bold text-slate-900")}>
              {curso.title}
            </h1>
            <p className={cn("mt-1 text-slate-500")}>
              {curso.description || "Sem descrição"}
            </p>
          </div>

          <div className={cn("flex flex-col gap-2 text-right")}>
            <div className={cn("text-sm text-slate-500")}>
              Progresso:{" "}
              <span className={cn("font-semibold text-slate-700")}>
                {percentual}%
              </span>
            </div>
            <div className={cn("text-sm text-slate-500")}>
              {aulasConcluidas} de {totalAulas} aulas concluídas
            </div>
            <div
              className={cn(
                "h-2 w-48 overflow-hidden rounded-full bg-slate-100",
              )}
            >
              <div
                className={cn(
                  "h-full rounded-full",
                  percentual === 100 ? "bg-green-500" : "bg-blue-600",
                )}
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("rounded-lg border bg-white shadow-sm")}>
        <div className={cn("border-b p-4")}>
          <h2 className={cn("text-lg font-semibold text-slate-900")}>
            Aulas do Curso
          </h2>
        </div>

        {aulasComProgresso.length === 0 ? (
          <div className={cn("p-12 text-center")}>
            <p className={cn("text-slate-500")}>
              Este curso ainda não tem aulas cadastradas.
            </p>
          </div>
        ) : (
          <div className={cn("divide-y")}>
            {aulasComProgresso.map((aula, index) => (
              <Link
                key={aula.id}
                href={`/minha-area/cursos/${cursoId}/aulas/${aula.id}`}
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                    aula.concluida
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600",
                  )}
                >
                  {aula.concluida ? "✓" : index + 1}
                </span>

                <div className={cn("flex-1 min-w-0")}>
                  <h3
                    className={cn(
                      "truncate font-medium",
                      aula.concluida ? "text-green-700" : "text-slate-900",
                    )}
                  >
                    {aula.title}
                  </h3>
                  {aula.duration_seconds && (
                    <p className={cn("text-xs text-slate-500")}>
                      {Math.floor(aula.duration_seconds / 60)} min
                    </p>
                  )}
                </div>

                <span
                  className={cn(
                    "text-sm text-slate-500",
                    aula.concluida ? "text-green-600" : "",
                  )}
                >
                  {aula.concluida ? "✓ Assistida" : "Assistir →"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
