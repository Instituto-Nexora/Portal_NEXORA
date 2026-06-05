"use server"

import { createClient } from "@/lib/supabase/server"

export async function marcarAulaConcluida(aulaId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Não autenticado")

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: aulaId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  )

  if (error) throw new Error(error.message)
}

export async function desmarcarAulaConcluida(aulaId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Não autenticado")

  const { error } = await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", aulaId)

  if (error) throw new Error(error.message)
}
