"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { cursoSchema } from "@/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/schema"
import type { ActionState } from "@/lib/supabase/types"

export async function atualizarCurso(
  cursoId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    thumbnail_url: formData.get("thumbnail_url") || undefined,
    price_cents: Number(formData.get("price_cents")),
    is_published: formData.get("is_published") === "true",
  }

  const parsed = cursoSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("courses")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      thumbnail_url: parsed.data.thumbnail_url || null,
      price_cents: parsed.data.price_cents,
      is_published: parsed.data.is_published,
    })
    .eq("id", cursoId)

  if (error) return { success: false, message: error.message }

  revalidatePath("/cms/dashboard/cursos")
  redirect("/cms/dashboard/cursos")
}
