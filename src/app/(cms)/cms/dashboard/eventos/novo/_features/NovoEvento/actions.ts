"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { slugify } from "@/utils/slugify";
import { eventoSchema } from "./schema";

export async function criarEvento(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    type: formData.get("type"),
    status: formData.get("status"),
    scheduled_at: formData.get("scheduled_at") || undefined,
    duration_minutes: formData.get("duration_minutes") || undefined,
    youtube_url: formData.get("youtube_url") || undefined,
  };

  const parsed = eventoSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const thumbnailFile = formData.get("thumbnail_file") as File | null;
  if (!thumbnailFile || thumbnailFile.size === 0) {
    return { errors: { thumbnail_file: ["Thumbnail é obrigatória"] } };
  }

  const adminClient = createAdminClient();

  let thumbnail_url: string | null = null;
  if (thumbnailFile.size > 0) {
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    const path = `eventos/${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("images")
      .upload(path, thumbnailFile, { upsert: false });
    if (uploadError) {
      return { message: "Erro ao fazer upload da thumbnail. Tente novamente." };
    }
    const { data: publicData } = adminClient.storage
      .from("images")
      .getPublicUrl(uploadData.path);
    thumbnail_url = publicData.publicUrl;
  }

  const slug = slugify(parsed.data.title);

  const { error } = await adminClient.from("events").insert({
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    long_description: parsed.data.long_description ?? null,
    type: parsed.data.type,
    status: parsed.data.status,
    scheduled_at: parsed.data.scheduled_at ?? null,
    duration_minutes: parsed.data.duration_minutes
      ? Number(parsed.data.duration_minutes)
      : null,
    thumbnail_url,
    youtube_url: parsed.data.youtube_url || null,
  });

  if (error) {
    return { message: "Erro ao criar evento. Tente novamente." };
  }

  revalidatePath("/eventos");
  redirect("/cms/dashboard/eventos");
}
