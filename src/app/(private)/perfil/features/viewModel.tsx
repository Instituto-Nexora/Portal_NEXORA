"use client";

import { useActionState, startTransition, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alterarSenhaSchema, perfilSchema } from "./schema";
import { alterarSenha, atualizarPerfil, atualizarAvatar } from "./actions";
import { useTheme } from "@/hooks/useTheme";
import { useChangeFont } from "@/hooks/useChangeFont";
import type { ActionState, AlterarSenhaFormData, PerfilFormData, PerfilInitialData } from "./model";

export type PasswordStrength = {
  score: number;
  label: string;
  barColor: string;
  textColor: string;
};

export type PerfilViewModel = {
  // Formulário de Perfil
  formPerfil: UseFormReturn<PerfilFormData>;
  onSubmitPerfil: SubmitHandler<PerfilFormData>;
  statusPerfil: ActionState | null;
  isPendingPerfil: boolean;

  // Formulário de Senha
  formSenha: UseFormReturn<AlterarSenhaFormData>;
  onSubmitSenha: SubmitHandler<AlterarSenhaFormData>;
  statusSenha: ActionState | null;
  isPendingSenha: boolean;
  passwordStrength: PasswordStrength;

  // Formulário de Avatar
  statusAvatar: ActionState | null;
  avatarFormAction: (payload: FormData) => void;
  isPendingAvatar: boolean;
  avatarPreview: string | null;
  handleAvatarPreview: (event: React.ChangeEvent<HTMLInputElement>) => void;

  // Acessibilidade
  theme: ReturnType<typeof useTheme>["theme"];
  setTheme: ReturnType<typeof useTheme>["setTheme"];
  fontSize: ReturnType<typeof useChangeFont>["fontSize"];
  fontOptions: ReturnType<typeof useChangeFont>["options"];
  setFontSize: ReturnType<typeof useChangeFont>["setFontSize"];
};

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "", barColor: "bg-transparent", textColor: "text-transparent" };
  
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 1) return { score: 20, label: "Senha fraca", barColor: "bg-red-500", textColor: "text-red-500" };
  if (score === 2 || score === 3) return { score: 50, label: "Senha média", barColor: "bg-amber-500", textColor: "text-amber-500" };
  if (score === 4) return { score: 75, label: "Senha boa", barColor: "bg-teal-500", textColor: "text-teal-500" };
  return { score: 100, label: "Senha excelente", barColor: "bg-emerald-500", textColor: "text-emerald-500" };
}

export function usePerfilViewModel({ initialData }: { initialData: PerfilInitialData }): PerfilViewModel {
  const { theme, setTheme } = useTheme();
  const { fontSize, options: fontOptions, setFontSize } = useChangeFont();

  // --- Hooks para o formulário de Perfil ---
  const [statusPerfil, formActionPerfil, isPendingPerfil] = useActionState(atualizarPerfil, null);
  const formPerfil = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      full_name: initialData.full_name || "",
    },
  });

  const onSubmitPerfil: SubmitHandler<PerfilFormData> = (data) => {
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    startTransition(() => formActionPerfil(formData));
  };

  // --- Hooks para o formulário de Senha ---
  const [statusSenha, formActionSenha, isPendingSenha] = useActionState(alterarSenha, null);
  const formSenha = useForm<AlterarSenhaFormData>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const watchedPassword = formSenha.watch("new_password");
  const passwordStrength = useMemo(() => getPasswordStrength(watchedPassword ?? ""), [watchedPassword]);

  const onSubmitSenha: SubmitHandler<AlterarSenhaFormData> = (data) => {
    const formData = new FormData();
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password);
    startTransition(() => formActionSenha(formData));
  };

  // --- Hooks para o formulário de Avatar ---
  const [statusAvatar, avatarFormAction, isPendingAvatar] = useActionState(atualizarAvatar, null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleAvatarPreview = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAvatarPreview(null);
      return;
    }
    setAvatarPreview(URL.createObjectURL(file));
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // Efeito para limpar o formulário de senha após o sucesso
  useEffect(() => {
    if (statusSenha?.success) {
      formSenha.reset();
    }
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
    avatarPreview,
    handleAvatarPreview,
    theme,
    setTheme,
    fontSize,
    fontOptions,
    setFontSize,
  };
}