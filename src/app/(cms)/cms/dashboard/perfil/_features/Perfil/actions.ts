"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PerfilActionState } from "./model";
import { perfilSchema, senhaSchema } from "./schema";

const COOLDOWN_MS = 2 * 60 * 60 * 1000;
const AVATAR_BUCKET = "images/avatars";
const PROFILE_METADATA_KEY = "cms_profile_last_changed_at";
const AVATAR_METADATA_KEY = "cms_avatar_last_changed_at";
const PASSWORD_METADATA_KEY = "cms_password_last_changed_at";

type CooldownKey =
  | typeof PROFILE_METADATA_KEY
  | typeof AVATAR_METADATA_KEY
  | typeof PASSWORD_METADATA_KEY;

type AuthMetadata = Record<string, unknown>;

function getIsoMetadata(metadata: AuthMetadata, key: CooldownKey) {
  const value = metadata[key];

  if (typeof value !== "string") {
    return null;
  }

  return value;
}

function getCooldownMessage(lastChangedAt: string | null) {
  if (!lastChangedAt) {
    return null;
  }

  const nextChangeAt = new Date(lastChangedAt).getTime() + COOLDOWN_MS;
  const remainingMs = nextChangeAt - Date.now();

  if (remainingMs <= 0) {
    return null;
  }

  const remainingMinutes = Math.ceil(remainingMs / 60000);
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  const readable = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;

  return `Aguarde ${readable} para alterar novamente.`;
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension) {
    return "jpg";
  }

  if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
    return extension;
  }

  return "jpg";
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function atualizarPerfil(
  _prevState: PerfilActionState,
  formData: FormData,
): Promise<PerfilActionState> {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return {
      formId: "perfil",
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const parsed = perfilSchema.safeParse({
    full_name: formData.get("full_name"),
  });

  if (!parsed.success) {
    return {
      formId: "perfil",
      success: false,
      message: "Revise os dados informados.",
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("full_name")
    .eq("user_id", user.id)
    .single();

  if (profile?.full_name === parsed.data.full_name) {
    return {
      formId: "perfil",
      success: false,
      message: "Informe um nome diferente do nome atual.",
    };
  }

  const metadata = (user.user_metadata ?? {}) as AuthMetadata;
  const cooldownMessage = getCooldownMessage(
    getIsoMetadata(metadata, PROFILE_METADATA_KEY),
  );

  if (cooldownMessage) {
    return { formId: "perfil", success: false, message: cooldownMessage };
  }

  const now = new Date().toISOString();
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      ...metadata,
      full_name: parsed.data.full_name,
      [PROFILE_METADATA_KEY]: now,
    },
  });

  if (authError) {
    return {
      formId: "perfil",
      success: false,
      message: "Falha ao atualizar metadados do usuário.",
    };
  }

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("user_id", user.id);

  if (profileError) {
    return {
      formId: "perfil",
      success: false,
      message: "Falha ao sincronizar o perfil no CMS.",
    };
  }

  revalidatePath("/cms/dashboard/perfil");
  revalidatePath("/cms/dashboard");

  return {
    formId: "perfil",
    success: true,
    message: "Nome atualizado com sucesso.",
  };
}

export async function atualizarAvatar(
  _prevState: PerfilActionState,
  formData: FormData,
): Promise<PerfilActionState> {
  const { supabase, user } = await getAuthenticatedUser();

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

  const metadata = (user.user_metadata ?? {}) as AuthMetadata;
  const cooldownMessage = getCooldownMessage(
    getIsoMetadata(metadata, AVATAR_METADATA_KEY),
  );

  if (cooldownMessage) {
    return { formId: "avatar", success: false, message: cooldownMessage };
  }

  const adminClient = createAdminClient();
  const extension = getFileExtension(file);
  const path = `admin-profiles/${user.id}/avatar.${extension}`;
  const { data: uploadData, error: uploadError } = await adminClient.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError || !uploadData) {
    return {
      formId: "avatar",
      success: false,
      message: "Erro ao enviar avatar. Verifique se o bucket avatars existe.",
    };
  }

  const { data: publicData } = adminClient.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(uploadData.path);
  const avatarUrl = `${publicData.publicUrl}?v=${Date.now()}`;
  const now = new Date().toISOString();

  const { error: profileError } = await adminClient
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("user_id", user.id);

  if (profileError) {
    return {
      formId: "avatar",
      success: false,
      message: "Avatar enviado, mas falhou ao salvar no perfil.",
    };
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      ...metadata,
      avatar_url: avatarUrl,
      [AVATAR_METADATA_KEY]: now,
    },
  });

  if (authError) {
    return {
      formId: "avatar",
      success: false,
      message: "Avatar salvo, mas falhou ao atualizar metadados.",
    };
  }

  revalidatePath("/cms/dashboard/perfil");
  revalidatePath("/cms/dashboard");

  return {
    formId: "avatar",
    success: true,
    message: "Foto de perfil atualizada com sucesso.",
  };
}

export async function alterarSenha(
  _prevState: PerfilActionState,
  formData: FormData,
): Promise<PerfilActionState> {
  const { user } = await getAuthenticatedUser();

  if (!user) {
    return {
      formId: "senha",
      success: false,
      message: "Usuário não autenticado.",
    };
  }

  const parsed = senhaSchema.safeParse({
    new_password: formData.get("new_password"),
    confirm_password: formData.get("confirm_password"),
    otp_code: formData.get("otp_code") ?? undefined,
  });

  if (!parsed.success) {
    return {
      formId: "senha",
      success: false,
      message: parsed.error.issues[0]?.message ?? "Revise os dados informados.",
      errors: parsed.error.flatten((issue) => issue.message)
        .fieldErrors as Record<string, string[]>,
    };
  }

  const metadata = (user.user_metadata ?? {}) as AuthMetadata;
  const cooldownMessage = getCooldownMessage(
    getIsoMetadata(metadata, PASSWORD_METADATA_KEY),
  );

  if (cooldownMessage) {
    return { formId: "senha", success: false, message: cooldownMessage };
  }

  return {
    formId: "senha",
    success: false,
    message:
      "OTP real por e-mail ainda precisa ser conectado ao fluxo Supabase antes de liberar alteração de senha.",
  };
}
