import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { cn } from "@/lib/utils"
import type { Curso, Aula } from "@/lib/supabase/types"
import { AulasCMSView } from "./_features/AulasCMS/view"

export const metadata: Metadata = {
  title: "Aulas do Curso | CMS — NEXORA",
}

type Props = { params: Promise<{ cursoId: string }> }

export default async function CursoDetalhePage({ params }: Props) {
  const { cursoId } = await params
  const supabase = createAdminClient()

  const [cursoResult, aulasResult] = await Promise.all([
    supabase.from("courses").select("*").eq("id", cursoId).single(),
    supabase
      .from("lessons")
      .select("*")
      .eq("course_id", cursoId)
      .order("position", { ascending: true }),
  ])

  if (cursoResult.error || !cursoResult.data) notFound()

  if (aulasResult.error) {
    return (
      <div className={cn("p-6")}>
        <p className={cn("text-sm text-destructive")}>
          Erro ao carregar aulas: {aulasResult.error.message}
        </p>
      </div>
    )
  }

  return (
    <AulasCMSView
      curso={cursoResult.data as Curso}
      initialAulas={(aulasResult.data ?? []) as Aula[]}
    />
  )
}
