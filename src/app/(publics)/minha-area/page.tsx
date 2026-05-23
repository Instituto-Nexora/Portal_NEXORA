import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { calcularProgressoCurso } from "@/utils/calcularProgressoCurso"
import { CursoCard } from "./_features/MinhAreaCursos/CursoCard"
import type { EnrollmentComProgresso } from "./_features/MinhAreaCursos/CursoCard"
import { EmptyState } from "./_features/MinhAreaCursos/EmptyState"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Minha Área — NEXORA",
  description: "Seus cursos adquiridos no Instituto Nexora.",
}

export default async function MinhaAreaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      course_id,
      courses (
        id,
        title,
        thumbnail_url
      )
    `,
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("[minha-area] enrollments query error:", error.message)
    return (
      <main className={cn("max-w-5xl mx-auto px-6 py-12")}>
        <p className={cn("text-sm text-destructive")}>
          Não foi possível carregar os seus cursos. Tente novamente mais tarde.
        </p>
      </main>
    )
  }

  const enrollments: EnrollmentComProgresso[] = await Promise.all(
    (data ?? [])
      .filter(
        (e): e is typeof e & { courses: NonNullable<typeof e.courses> } =>
          e.courses != null,
      )
      .map(async (e) => {
        const curso = e.courses as unknown as EnrollmentComProgresso["courses"]
        const { concluidas, total, percentual } = await calcularProgressoCurso(
          e.course_id,
          user.id,
        )
        return {
          id: e.id,
          course_id: e.course_id,
          courses: curso,
          concluidas,
          total,
          percentual,
        }
      }),
  )

  return (
    <main className={cn("max-w-5xl mx-auto px-6 py-12")}>
      <div className={cn("mb-10")}>
        <h1 className={cn("text-3xl font-bold text-slate-900 mb-1")}>
          Minha Área
        </h1>
        <p className={cn("text-slate-500")}>Seus cursos adquiridos</p>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState />
      ) : (
        <ul
          className={cn(
            "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0",
          )}
        >
          {enrollments.map((enrollment) => (
            <li key={enrollment.id} className={cn("flex")}>
              <CursoCard enrollment={enrollment} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
