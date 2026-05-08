"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "./model";
import { createClient } from "@/lib/supabase/server";

export async function atualizarPerfil( _prev: ActionState | null, formData: FormData ): Promise<ActionState> {
  const full_name = formData.get("full_name")?.toString();

  if (!full_name || full_name.length < 2) {
    return { success: false, message: "Nome obrigatório e deve ter ao menos 2 caracteres" };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, message: "Usuário não autenticado." };
    }

    const { error: authUpdateError } = await supabase.auth.updateUser({ data: { full_name } });
    if (authUpdateError) throw authUpdateError;
    
    const { error: profileUpdateError } = await supabase.from('student_profiles').update({ full_name }).eq('id', user.id);
    if (profileUpdateError) throw profileUpdateError;

    revalidatePath("/minha-area");
    return { success: true, message: "Perfil atualizado com sucesso!" };
  } catch (error) {
    return { success: false, message: "Ocorreu um erro ao atualizar o perfil." };
  }
}

// Alterar senha
export async function alterarSenha(formData: FormData): Promise<ActionState> {
  const new_password = formData.get("new_password")?.toString();

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: new_password });
    if (error) throw error;

    return { success: true, message: "Sua senha foi alterada com sucesso!" };
  } catch (error) {
    return { success: false, message: "Ocorreu um erro ao tentar alterar a senha." };
  }
}
