"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { PerfilActionState } from "./model";
import { perfilSchema, senhaSchema } from "./schema";

const DAILY_CHANGE_LIMIT = 5;
const DAILY_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const AVATAR_BUCKET = "images/avatars";
const PROFILE_METADATA_KEY = "cms_profile_last_changed_at";
const AVATAR_METADATA_KEY = "cms_avatar_last_changed_at";
const PROFILE_HISTORY_METADATA_KEY = "cms_profile_change_history";
const AVATAR_HISTORY_METADATA_KEY = "cms_avatar_change_history";
const PASSWORD_HISTORY_METADATA_KEY = "cms_password_change_history";

type DailyHistoryKey =
  | typeof PROFILE_HISTORY_METADATA_KEY
  | typeof AVATAR_HISTORY_METADATA_KEY
  | typeof PASSWORD_HISTORY_METADATA_KEY;

type AuthMetadata = Record<string, unknown>;

type DailyLimitResult = {
  message: string;
  resetAt: string;
};

function getRecentDailyChanges(metadata: AuthMetadata, key: DailyHistoryKey) {
  const value = metadata[key];
  const now = Date.now();

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => {
    if (typeof entry !== "string") {
      return false;
    }

    const timestamp = new Date(entry).getTime();
    return (
      !Number.isNaN(timestamp) &&
      timestamp <= now &&
      now - timestamp < DAILY_LIMIT_WINDOW_MS
    );
  });
}

function getDailyLimit(metadata: AuthMetadata, key: DailyHistoryKey) {
  const recentChanges = getRecentDailyChanges(metadata, key);

  if (recentChanges.length < DAILY_CHANGE_LIMIT) {
    return null;
  }

  const oldestTimestamp = Math.min(
    ...recentChanges.map((entry) => new Date(entry).getTime()),
  );
  const resetAt = new Date(
    oldestTimestamp + DAILY_LIMIT_WINDOW_MS,
  ).toISOString();

  return {
    message:
      "Limite diário de 5 alterações alcançado. A alteração será disponibilizada novamente após 1 dia.",
    resetAt,
  } satisfies DailyLimitResult;
}

function createDailyLimitState(
  formId: NonNullable<PerfilActionState>["formId"],
  dailyLimit: DailyLimitResult,
): PerfilActionState {
  return {
    formId,
    success: false,
    message: dailyLimit.message,
    code: "daily_limit_reached",
    resetAt: dailyLimit.resetAt,
  };
}

function getUpdatedDailyHistory(
  metadata: AuthMetadata,
  key: DailyHistoryKey,
  now: string,
) {
  return [...getRecentDailyChanges(metadata, key), now].slice(
    -DAILY_CHANGE_LIMIT,
  );
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
  const dailyLimit = getDailyLimit(metadata, PROFILE_HISTORY_METADATA_KEY);

  if (dailyLimit) {
    return createDailyLimitState("perfil", dailyLimit);
  }

  const now = new Date().toISOString();
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      ...metadata,
      full_name: parsed.data.full_name,
      [PROFILE_METADATA_KEY]: now,
      [PROFILE_HISTORY_METADATA_KEY]: getUpdatedDailyHistory(
        metadata,
        PROFILE_HISTORY_METADATA_KEY,
        now,
      ),
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
  const dailyLimit = getDailyLimit(metadata, AVATAR_HISTORY_METADATA_KEY);

  if (dailyLimit) {
    return createDailyLimitState("avatar", dailyLimit);
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
      [AVATAR_HISTORY_METADATA_KEY]: getUpdatedDailyHistory(
        metadata,
        AVATAR_HISTORY_METADATA_KEY,
        now,
      ),
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
  const dailyLimit = getDailyLimit(metadata, PASSWORD_HISTORY_METADATA_KEY);

  if (dailyLimit) {
    return createDailyLimitState("senha", dailyLimit);
  }

  return {
    formId: "senha",
    success: false,
    message:
      "OTP real por e-mail ainda precisa ser conectado ao fluxo Supabase antes de liberar alteração de senha.",
  };
}
