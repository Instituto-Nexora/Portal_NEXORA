"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { cursoSchema } from "./schema";

export async function editarCurso(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    price_cents: formData.get("price_cents") || undefined,
    is_published: formData.get("is_published") === "true",
  };

  const parsed = cursoSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const adminClient = createAdminClient();

  let thumbnail_url: string | null = null;
  const thumbnailFile = formData.get("thumbnail_file") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    const path = `cursos/${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("images")
      .upload(path, thumbnailFile, { upsert: false });
    if (uploadError) {
      return { message: "Erro ao fazer upload da thumbnail." };
    }
    const { data: publicData } = adminClient.storage
      .from("images")
      .getPublicUrl(uploadData.path);
    thumbnail_url = publicData.publicUrl;
  }

  const updateData: Record<string, unknown> = {
    title: parsed.data.title,
    description: parsed.data.description,
    price_cents: parsed.data.price_cents
      ? Number(parsed.data.price_cents)
      : null,
    is_published: parsed.data.is_published,
  };

  if (thumbnail_url) {
    updateData.thumbnail_url = thumbnail_url;
  }

  const { error } = await adminClient
    .from("courses")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { message: `Erro ao atualizar curso: ${error.message}` };
  }

  revalidatePath("/cms/dashboard/cursos");
  redirect("/cms/dashboard/cursos");
}

export async function excluirCurso(id: string): Promise<ActionState> {
  const adminClient = createAdminClient();

  const { error } = await adminClient.from("courses").delete().eq("id", id);

  if (error) {
    return { message: `Erro ao excluir curso: ${error.message}` };
  }

  revalidatePath("/cms/dashboard/cursos");
  redirect("/cms/dashboard/cursos");
}
