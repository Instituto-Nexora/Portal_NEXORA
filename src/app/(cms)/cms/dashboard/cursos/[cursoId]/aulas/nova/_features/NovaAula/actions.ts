"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { aulaSchema } from "./schema"
import type { ActionState } from "@/lib/supabase/types"

export async function criarAula(
  cursoId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    title: formData.get("title"),
    video_url: formData.get("video_url") || undefined,
    position: Number(formData.get("position")),
    duration_seconds: formData.get("duration_seconds")
      ? Number(formData.get("duration_seconds"))
      : undefined,
    is_published: formData.get("is_published") === "true",
  }

  const parsed = aulaSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from("lessons").insert({
    course_id: cursoId,
    title: parsed.data.title,
    video_url: parsed.data.video_url || null,
    position: parsed.data.position,
    duration_seconds: parsed.data.duration_seconds ?? null,
    is_published: parsed.data.is_published,
  })

  if (error) return { success: false, message: error.message }

  revalidatePath(`/cms/dashboard/cursos/${cursoId}`)
  redirect(`/cms/dashboard/cursos/${cursoId}`)
}
