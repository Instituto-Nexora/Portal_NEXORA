"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { aulaSchema } from "./schema";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function criarAula(
  cursoId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!uuidRegex.test(cursoId)) {
    return { message: "ID do curso inválido. Acesse a página de detalhes do curso para gerenciar aulas." };
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

  const { data: maxData } = await adminClient
    .from("lessons")
    .select("position")
    .eq("course_id", cursoId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (maxData?.position ?? -1) + 1;

  const { error } = await adminClient.from("lessons").insert({
    course_id: cursoId,
    title: parsed.data.title,
    video_url: parsed.data.video_url || null,
    material_url: parsed.data.material_url || null,
    position: nextPosition,
    is_published: parsed.data.is_published,
  });

  if (error) {
    return { message: `Erro ao criar aula: ${error.message}` };
  }

  revalidatePath(`/cms/dashboard/cursos/${cursoId}/aulas`);
  redirect(`/cms/dashboard/cursos/${cursoId}/aulas`);
}
