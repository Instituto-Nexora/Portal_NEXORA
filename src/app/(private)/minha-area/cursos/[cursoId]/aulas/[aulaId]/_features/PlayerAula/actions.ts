"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function marcarConcluida(aulaId: string, cursoId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: aulaId,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id, lesson_id" },
  );

  if (error) {
    throw new Error("Erro ao salvar progresso");
  }

  revalidatePath(`/minha-area/cursos/${cursoId}/aulas/${aulaId}`, "page");
  revalidatePath(`/minha-area/cursos/${cursoId}`, "page");
  revalidatePath("/minha-area", "page");
}

export async function desmarcarConcluida(aulaId: string, cursoId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: aulaId,
      completed_at: null,
    },
    { onConflict: "user_id, lesson_id" },
  );

  if (error) {
    throw new Error("Erro ao remover progresso");
  }

  revalidatePath(`/minha-area/cursos/${cursoId}/aulas/${aulaId}`, "page");
  revalidatePath(`/minha-area/cursos/${cursoId}`, "page");
  revalidatePath("/minha-area", "page");
}
