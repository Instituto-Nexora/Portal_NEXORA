"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { startTransition, useActionState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { useChangeFont } from "@/hooks/useChangeFont";
import { useTheme } from "@/hooks/useTheme";
import { getPasswordStrength, type PasswordStrength } from "@/utils/getPasswordStrength";
import { notifyStatus } from "@/utils/notifyStatus";
import { alterarSenha, atualizarAvatar, atualizarPerfil } from "./actions";
import type { PerfilActionState, PerfilInitialData } from "./model";
import {
  type PerfilFormData,
  perfilSchema,
  type SenhaFormData,
  senhaSchema,
} from "./schema";

type UsePerfilViewModelParams = {
  initialData: PerfilInitialData;
};

type PerfilViewModel = {
  formPerfil: UseFormReturn<PerfilFormData>;
  onSubmitPerfil: SubmitHandler<PerfilFormData>;
  statusPerfil: PerfilActionState;
  isPendingPerfil: boolean;
  statusAvatar: PerfilActionState;
  avatarFormAction: (payload: FormData) => void;
  isPendingAvatar: boolean;
  formSenha: UseFormReturn<SenhaFormData>;
  onSubmitSenha: SubmitHandler<SenhaFormData>;
  statusSenha: PerfilActionState;
  isPendingSenha: boolean;
  passwordStrength: PasswordStrength;
  theme: ReturnType<typeof useTheme>["theme"];
  setTheme: ReturnType<typeof useTheme>["setTheme"];
  fontSize: ReturnType<typeof useChangeFont>["fontSize"];
  fontOptions: ReturnType<typeof useChangeFont>["options"];
  setFontSize: ReturnType<typeof useChangeFont>["setFontSize"];
};

function usePerfilViewModel({
  initialData,
}: UsePerfilViewModelParams): PerfilViewModel {
  const [statusPerfil, formActionPerfil, isPendingPerfil] = useActionState(
    atualizarPerfil,
    null,
  );
  const [statusAvatar, avatarFormAction, isPendingAvatar] = useActionState(
    atualizarAvatar,
    null,
  );
  const [statusSenha, formActionSenha, isPendingSenha] = useActionState(
    alterarSenha,
    null,
  );
  const { theme, setTheme } = useTheme();
  const { fontSize, options: fontOptions, setFontSize } = useChangeFont();

  const formPerfil = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      full_name: initialData.fullName,
    },
  });

  const formSenha = useForm<SenhaFormData>({
    resolver: zodResolver(senhaSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
      otp_code: "",
    },
  });

  const watchedPassword = formSenha.watch("new_password");
  const passwordStrength = React.useMemo(
    () => getPasswordStrength(watchedPassword ?? ""),
    [watchedPassword],
  );

  const onSubmitPerfil: SubmitHandler<PerfilFormData> = (data) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    startTransition(() => formActionPerfil(formData));
  };

  const onSubmitSenha: SubmitHandler<SenhaFormData> = (data) => {
    const formData = new FormData();
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password);
    formData.append("otp_code", data.otp_code ?? "");
    startTransition(() => formActionSenha(formData));
  };

  React.useEffect(() => notifyStatus(statusPerfil), [statusPerfil]);
  React.useEffect(() => notifyStatus(statusAvatar), [statusAvatar]);
  React.useEffect(() => notifyStatus(statusSenha), [statusSenha]);

  React.useEffect(() => {
    if (statusSenha?.success) {
      formSenha.reset();
    }
  }, [formSenha, statusSenha]);

  return {
    formPerfil,
    onSubmitPerfil,
    statusPerfil,
    isPendingPerfil,
    statusAvatar,
    avatarFormAction,
    isPendingAvatar,
    formSenha,
    onSubmitSenha,
    statusSenha,
    isPendingSenha,
    passwordStrength,
    theme,
    setTheme,
    fontSize,
    fontOptions,
    setFontSize,
  };
}

export { usePerfilViewModel };
export type { PerfilViewModel };
