import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Aula } from "@/lib/supabase/types"
import { EditarAulaView } from "./_features/EditarAula/view"

export const metadata: Metadata = {
  title: "Editar Aula | CMS — NEXORA",
}

type Props = { params: Promise<{ cursoId: string; aulaId: string }> }

export default async function EditarAulaPage({ params }: Props) {
  const { aulaId } = await params

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", aulaId)
    .single()

  if (error || !data) notFound()

  return <EditarAulaView aula={data as Aula} />
}
