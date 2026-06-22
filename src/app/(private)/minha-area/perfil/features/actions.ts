"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./model";
import { alterarSenhaSchema, perfilSchema } from "./schema";

export async function atualizarPerfil(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      formId: "perfil",
      success: false,
      message: "Usuário não autenticado.",
    };

  const full_name = formData.get("full_name")?.toString() || "";
  const parsed = perfilSchema.safeParse({ full_name });

  if (!parsed.success) {
    return { formId: "perfil", success: false, message: "Nome inválido." };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name },
  });
  if (authError)
    return {
      formId: "perfil",
      success: false,
      message: "Falha ao atualizar o nome.",
    };

  const { error: profileError } = await supabase
    .from("student_profiles")
    .update({ full_name })
    .eq("id", user.id);
  if (profileError)
    return {
      formId: "perfil",
      success: false,
      message: "Falha ao sincronizar o perfil.",
    };

  revalidatePath("/minha-area/perfil");
  return {
    formId: "perfil",
    success: true,
    message: "Nome atualizado com sucesso!",
  };
}

export async function alterarSenha(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      formId: "senha",
      success: false,
      message: "Usuário não autenticado.",
    };

  const new_password = formData.get("new_password")?.toString() || "";
  const confirm_password = formData.get("confirm_password")?.toString() || "";

  const parsed = alterarSenhaSchema.safeParse({
    new_password,
    confirm_password,
  });

  if (!parsed.success) {
    const errorMessage = parsed.error.issues[0]?.message || "Dados inválidos.";
    return { formId: "senha", success: false, message: errorMessage };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: new_password,
    });
    if (error) throw error;
  } catch (_error) {
    return {
      formId: "senha",
      success: false,
      message: "Ocorreu um erro ao alterar sua senha. Tente novamente.",
    };
  }

  return {
    formId: "senha",
    success: true,
    message: "Senha alterada com sucesso!",
  };
}

export async function atualizarAvatar(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      formId: "avatar",
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const file = formData.get("avatar_file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      formId: "avatar",
      success: false,
      message: "Selecione uma imagem para enviar.",
    };
  }
  if (!file.type.startsWith("image/")) {
    return {
      formId: "avatar",
      success: false,
      message: "Envie um arquivo de imagem válido.",
    };
  }
  if (file.size > 5 * 1024 * 1024) {
    return {
      formId: "avatar",
      success: false,
      message: "A imagem deve ter até 5MB.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `avatars/student-profiles/${user.id}/avatar.${extension}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadError || !uploadData) {
    console.error("Erro Supabase Storage:", uploadError);
    return {
      formId: "avatar",
      success: false,
      message: `Falha no upload: ${uploadError?.message || "Erro desconhecido"}. Verifique o RLS do bucket.`,
    };
  }

  const { data: publicData } = supabase.storage
    .from("images")
    .getPublicUrl(uploadData.path);
  const avatarUrl = `${publicData.publicUrl}?v=${Date.now()}`;

  const { error: profileError } = await supabase
    .from("student_profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (profileError) {
    return {
      formId: "avatar",
      success: false,
      message: "Avatar enviado, mas falhou ao salvar no perfil.",
    };
  }

  revalidatePath("/minha-area/perfil");
  return {
    formId: "avatar",
    success: true,
    message: "Foto de perfil atualizada com sucesso.",
  };
}
