"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { alterarSenhaSchema, perfilSchema } from "./schema";
import type { ActionState } from "./model";

export async function atualizarPerfil(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { formId: "perfil", success: false, message: "Usuário não autenticado." };

  const full_name = formData.get("full_name")?.toString() || "";
  const parsed = perfilSchema.safeParse({ full_name });

  if (!parsed.success) {
    return { formId: "perfil", success: false, message: "Nome inválido." };
  }

  const { error: authError } = await supabase.auth.updateUser({ data: { full_name } });
  if (authError) return { formId: "perfil", success: false, message: "Falha ao atualizar o nome." };

  const { error: profileError } = await supabase.from("student_profiles").update({ full_name }).eq("id", user.id);
  if (profileError) return { formId: "perfil", success: false, message: "Falha ao sincronizar o perfil." };

  revalidatePath("/minha-area/perfil");
  return { formId: "perfil", success: true, message: "Nome atualizado com sucesso!" };
}

export async function alterarSenha(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { formId: "senha", success: false, message: "Usuário não autenticado." };

  const new_password = formData.get("new_password")?.toString() || "";
  const confirm_password = formData.get("confirm_password")?.toString() || "";

  const parsed = alterarSenhaSchema.safeParse({ new_password, confirm_password });

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Dados inválidos.";
    return { formId: "senha", success: false, message: errorMessage };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: new_password });
    if (error) throw error;
  } catch (error) {
    return {
      formId: "senha",
      success: false,
      message: "Ocorreu um erro ao alterar sua senha. Tente novamente.",
    };
  }

  return { formId: "senha", success: true, message: "Senha alterada com sucesso!" };
}