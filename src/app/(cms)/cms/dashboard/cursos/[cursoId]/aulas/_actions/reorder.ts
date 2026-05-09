"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";

export async function reordenarAulas(aulaIds: string[]): Promise<ActionState> {
  const adminClient = createAdminClient();

  const updates = aulaIds.map((id, index) => ({
    id,
    position: index,
  }));

  for (const update of updates) {
    const { error } = await adminClient
      .from("lessons")
      .update({ position: update.position })
      .eq("id", update.id);

    if (error) {
      return { message: `Erro ao reordenar aula: ${error.message}` };
    }
  }

  revalidatePath("/cms/dashboard/cursos/[cursoId]/aulas");
}
