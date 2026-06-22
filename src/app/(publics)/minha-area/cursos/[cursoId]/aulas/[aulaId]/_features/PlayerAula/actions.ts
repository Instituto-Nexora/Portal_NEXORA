"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function marcarAulaConcluida(
  cursoId: string,
  aulaId: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from("lesson_progress").upsert(
    { user_id: userId, lesson_id: aulaId },
    { onConflict: "user_id,lesson_id" },
  )
  if (error) throw new Error(error.message)
  revalidatePath(`/minha-area/cursos/${cursoId}/aulas/${aulaId}`)
  revalidatePath(`/minha-area/cursos/${cursoId}`)
  revalidatePath("/minha-area")
}
