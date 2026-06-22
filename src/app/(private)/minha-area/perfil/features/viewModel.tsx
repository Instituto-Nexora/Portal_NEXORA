"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { useChangeFont } from "@/hooks/useChangeFont";
import { useTheme } from "@/hooks/useTheme";
import {
  getPasswordStrength,
  type PasswordStrength,
} from "@/utils/getPasswordStrength";
import { notifyStatus } from "@/utils/notifyStatus";
import { alterarSenha, atualizarAvatar, atualizarPerfil } from "./actions";
import type {
  ActionState,
  AlterarSenhaFormData,
  PerfilFormData,
  PerfilInitialData,
} from "./model";
import { alterarSenhaSchema, perfilSchema } from "./schema";

export type PerfilViewModel = {
  formPerfil: UseFormReturn<PerfilFormData>;
  onSubmitPerfil: SubmitHandler<PerfilFormData>;
  statusPerfil: ActionState | null;
  isPendingPerfil: boolean;
  formSenha: UseFormReturn<AlterarSenhaFormData>;
  onSubmitSenha: SubmitHandler<AlterarSenhaFormData>;
  statusSenha: ActionState | null;
  isPendingSenha: boolean;
  passwordStrength: PasswordStrength;
  statusAvatar: ActionState | null;
  avatarFormAction: (payload: FormData) => void;
  isPendingAvatar: boolean;
  theme: ReturnType<typeof useTheme>["theme"];
  setTheme: ReturnType<typeof useTheme>["setTheme"];
  fontSize: ReturnType<typeof useChangeFont>["fontSize"];
  fontOptions: ReturnType<typeof useChangeFont>["options"];
  setFontSize: ReturnType<typeof useChangeFont>["setFontSize"];
};

export function usePerfilViewModel({
  initialData,
}: {
  initialData: PerfilInitialData;
}): PerfilViewModel {
  const { theme, setTheme } = useTheme();
  const { fontSize, options: fontOptions, setFontSize } = useChangeFont();

  const [statusPerfil, formActionPerfil, isPendingPerfil] = useActionState(
    atualizarPerfil,
    null,
  );
  const formPerfil = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { full_name: initialData.full_name || "" },
  });

  const onSubmitPerfil: SubmitHandler<PerfilFormData> = (data) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    startTransition(() => formActionPerfil(formData));
  };

  const [statusSenha, formActionSenha, isPendingSenha] = useActionState(
    alterarSenha,
    null,
  );
  const formSenha = useForm<AlterarSenhaFormData>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: { new_password: "", confirm_password: "" },
  });

  const watchedPassword = formSenha.watch("new_password");
  const passwordStrength = useMemo(
    () => getPasswordStrength(watchedPassword ?? ""),
    [watchedPassword],
  );

  const onSubmitSenha: SubmitHandler<AlterarSenhaFormData> = (data) => {
    const formData = new FormData();
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password);
    startTransition(() => formActionSenha(formData));
  };

  const [statusAvatar, avatarFormAction, isPendingAvatar] = useActionState(
    atualizarAvatar,
    null,
  );

  useEffect(() => notifyStatus(statusPerfil), [statusPerfil]);
  useEffect(() => notifyStatus(statusAvatar), [statusAvatar]);
  useEffect(() => notifyStatus(statusSenha), [statusSenha]);

  useEffect(() => {
    if (statusSenha?.success) formSenha.reset();
  }, [statusSenha, formSenha]);

  return {
    formPerfil,
    onSubmitPerfil,
    statusPerfil,
    isPendingPerfil,
    formSenha,
    onSubmitSenha,
    statusSenha,
    isPendingSenha,
    passwordStrength,
    statusAvatar,
    avatarFormAction,
    isPendingAvatar,
    theme,
    setTheme,
    fontSize,
    fontOptions,
    setFontSize,
  };
}
