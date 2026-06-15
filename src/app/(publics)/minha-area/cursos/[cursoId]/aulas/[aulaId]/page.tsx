import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { Aula, Curso } from "@/lib/supabase/types"
import { PlayerAulaView } from "./_features/PlayerAula/view"

export const metadata: Metadata = {
  title: "Assistir Aula | NEXORA",
}

type Props = { params: Promise<{ cursoId: string; aulaId: string }> }

export default async function PlayerAulaPage({ params }: Props) {
  const { cursoId, aulaId } = await params
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

  if (!enrollment) redirect("/vendas")

  const [cursoResult, aulasResult, aulaResult, progressResult] =
    await Promise.all([
      supabase.from("courses").select("*").eq("id", cursoId).single(),
      supabase
        .from("lessons")
        .select("*")
        .eq("course_id", cursoId)
        .eq("is_published", true)
        .order("position", { ascending: true }),
      supabase.from("lessons").select("*").eq("id", aulaId).eq("course_id", cursoId).single(),
      supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id),
    ])

  if (cursoResult.error || !cursoResult.data) notFound()
  if (aulaResult.error || !aulaResult.data) notFound()

  const aulasConcluidas = (progressResult.data ?? []).map(
    (p: { lesson_id: string }) => p.lesson_id,
  )

  return (
    <PlayerAulaView
      aula={aulaResult.data as Aula}
      curso={cursoResult.data as Curso}
      aulas={(aulasResult.data ?? []) as Aula[]}
      aulasConcluidas={aulasConcluidas}
      userId={user.id}
    />
  )
}
