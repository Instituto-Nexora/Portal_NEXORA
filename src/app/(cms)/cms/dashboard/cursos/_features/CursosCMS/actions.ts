"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function deletarCurso(cursoId: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.from("courses").delete().eq("id", cursoId)
  if (error) throw new Error(error.message)
  revalidatePath("/cms/dashboard/cursos")
}

export async function togglePublicacao(
  cursoId: string,
  isPublished: boolean,
): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("courses")
    .update({ is_published: !isPublished })
    .eq("id", cursoId)
  if (error) throw new Error(error.message)
  revalidatePath("/cms/dashboard/cursos")
}
