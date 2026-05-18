"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { startTransition, useActionState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { useChangeFont } from "@/hooks/useChangeFont";
import { useTheme } from "@/hooks/useTheme";
import { alterarSenha, atualizarAvatar, atualizarPerfil } from "./actions";
import type {
  PasswordStrength,
  PerfilActionState,
  PerfilInitialData,
} from "./model";
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
  avatarPreview: string | null;
  handleAvatarPreview: (event: React.ChangeEvent<HTMLInputElement>) => void;
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

function getPasswordStrength(password: string): PasswordStrength {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 1) {
    return { score: 20, label: "Senha ruim", className: "bg-red-800" };
  }

  if (score === 2 || score === 3) {
    return { score: 50, label: "Senha média", className: "bg-orange-800" };
  }

  if (score === 4) {
    return { score: 75, label: "Senha boa", className: "bg-green-800" };
  }

  return { score: 100, label: "Senha excelente", className: "bg-emerald-800" };
}

function notifyStatus(status: PerfilActionState) {
  if (!status?.message) {
    return;
  }

  if (status.success) {
    toast.success(status.message);
    return;
  }

  toast.error(status.message);
}

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
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
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

  const handleAvatarPreview = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        setAvatarPreview(null);
        return;
      }

      setAvatarPreview(URL.createObjectURL(file));
    },
    [],
  );

  React.useEffect(() => notifyStatus(statusPerfil), [statusPerfil]);
  React.useEffect(() => notifyStatus(statusAvatar), [statusAvatar]);
  React.useEffect(() => notifyStatus(statusSenha), [statusSenha]);

  React.useEffect(() => {
    if (statusSenha?.success) {
      formSenha.reset();
    }
  }, [formSenha, statusSenha]);

  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return {
    formPerfil,
    onSubmitPerfil,
    statusPerfil,
    isPendingPerfil,
    statusAvatar,
    avatarFormAction,
    isPendingAvatar,
    avatarPreview,
    handleAvatarPreview,
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
