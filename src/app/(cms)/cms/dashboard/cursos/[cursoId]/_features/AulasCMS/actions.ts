"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function deletarAula(cursoId: string, aulaId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("lessons").delete().eq("id", aulaId)
  if (error) throw new Error(error.message)
  revalidatePath(`/cms/dashboard/cursos/${cursoId}`)
}

export async function togglePublicacaoAula(
  cursoId: string,
  aulaId: string,
  isPublished: boolean,
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("lessons")
    .update({ is_published: !isPublished })
    .eq("id", aulaId)
  if (error) throw new Error(error.message)
  revalidatePath(`/cms/dashboard/cursos/${cursoId}`)
}
