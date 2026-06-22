import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

type Props = { params: Promise<{ cursoId: string }> }

export default async function AulasRedirectPage({ params }: Props) {
  const { cursoId } = await params

  const supabase = await createClient()

  const { data: primeiraAula } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", cursoId)
    .eq("is_published", true)
    .order("position", { ascending: true })
    .limit(1)
    .single()

  if (!primeiraAula) notFound()

  redirect(`/minha-area/cursos/${cursoId}/aulas/${primeiraAula.id}`)
}
