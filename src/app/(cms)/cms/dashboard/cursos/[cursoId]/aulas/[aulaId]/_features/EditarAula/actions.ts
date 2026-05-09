"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { aulaSchema } from "./schema";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function atualizarAula(
  aulaId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const cursoId = formData.get("curso_id") as string;
  if (!uuidRegex.test(cursoId)) {
    return { message: "ID do curso inválido." };
  }

  const raw = {
    title: formData.get("title"),
    video_url: formData.get("video_url") || undefined,
    material_url: formData.get("material_url") || undefined,
    is_published: formData.get("is_published") === "true",
  };

  const parsed = aulaSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("lessons")
    .update({
      title: parsed.data.title,
      video_url: parsed.data.video_url || null,
      material_url: parsed.data.material_url || null,
      is_published: parsed.data.is_published,
    })
    .eq("id", aulaId);

  if (error) {
    return { message: `Erro ao atualizar aula: ${error.message}` };
  }

  revalidatePath(`/cms/dashboard/cursos/${cursoId}/aulas`);
  redirect(`/cms/dashboard/cursos/${cursoId}/aulas`);
}

export async function deletarAula(
  aulaId: string,
  cursoId: string,
): Promise<ActionState> {
  if (!uuidRegex.test(cursoId)) {
    return { message: "ID do curso inválido." };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from("lessons").delete().eq("id", aulaId);

  if (error) {
    return { message: `Erro ao excluir aula: ${error.message}` };
  }

  revalidatePath(`/cms/dashboard/cursos/${cursoId}/aulas`);
  redirect(`/cms/dashboard/cursos/${cursoId}/aulas`);
}
