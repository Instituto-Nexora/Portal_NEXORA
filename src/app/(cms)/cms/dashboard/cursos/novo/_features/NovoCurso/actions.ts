"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { cursoSchema } from "./schema";

export async function criarCurso(
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

  const { error } = await adminClient.from("courses").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    thumbnail_url,
    price_cents: parsed.data.price_cents
      ? Number(parsed.data.price_cents)
      : null,
    is_published: parsed.data.is_published,
  });

  if (error) {
    return { message: `Erro ao criar curso: ${error.message}` };
  }

  revalidatePath("/cms/dashboard/cursos");
  redirect("/cms/dashboard/cursos");
}
