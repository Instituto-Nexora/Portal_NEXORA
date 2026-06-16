"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/supabase/types";
import { editAdminSchema } from "./editAdminSchema";

export async function editarAdmin(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    full_name: formData.get("full_name"),
    role: formData.get("role"),
  };

  const parsed = editAdminSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ full_name: parsed.data.full_name, role: parsed.data.role })
    .eq("id", id);

  if (error) {
    return { message: "Erro ao atualizar administrador. Tente novamente." };
  }

  revalidatePath("/cms/dashboard/admins");
  return { success: true, message: "Administrador atualizado com sucesso." };
}
