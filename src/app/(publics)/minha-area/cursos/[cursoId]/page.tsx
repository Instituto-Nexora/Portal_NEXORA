import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { Curso, Aula, ProgressResult } from "@/lib/supabase/types"
import { DetalhesCursoView } from "./_features/DetalhesCurso/view"

type Props = { params: Promise<{ cursoId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cursoId } = await params
  const supabase = await createClient()
  const { data: curso } = await supabase
    .from("courses")
    .select("title")
    .eq("id", cursoId)
    .single()
  return {
    title: curso ? `${curso.title} | NEXORA` : "Curso | NEXORA",
  }
}

export default async function DetalhesCursoPage({ params }: Props) {
  const { cursoId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", cursoId)
    .single()

  if (!enrollment) notFound()

  const [cursoResult, aulasResult] = await Promise.all([
    supabase.from("courses").select("*").eq("id", cursoId).single(),
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", cursoId)
      .eq("is_published", true)
      .order("position", { ascending: true }),
  ])

  if (cursoResult.error || !cursoResult.data) notFound()

  if (aulasResult.error) {
    throw new Error(aulasResult.error.message)
  }

  const aulas = (aulasResult.data ?? []) as Aula[]
  const lessonIds = aulas.map((a) => a.id)

  let concluidas = new Set<string>()
  if (lessonIds.length > 0) {
    const { data: progressData } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds)
    concluidas = new Set(
      (progressData ?? []).map((p: { lesson_id: string }) => p.lesson_id),
    )
  }

  const total = lessonIds.length
  const numConcluidas = concluidas.size
  const percentual = total > 0 ? Math.round((numConcluidas / total) * 100) : 0

  const progresso: ProgressResult = { concluidas: numConcluidas, total, percentual }

  return (
    <DetalhesCursoView
      curso={cursoResult.data as Curso}
      aulas={aulas}
      concluidas={concluidas}
      progresso={progresso}
    />
  )
}
