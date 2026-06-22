import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Curso } from "@/lib/supabase/types"
import { EditarCursoView } from "./_features/EditarCurso/view"

export const metadata: Metadata = {
  title: "Editar Curso | CMS — NEXORA",
}

type Props = {
  params: Promise<{ cursoId: string }>
}

export default async function EditarCursoPage({ params }: Props) {
  const { cursoId } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", cursoId)
    .single()

  if (error || !data) notFound()

  return <EditarCursoView curso={data as Curso} />
}
