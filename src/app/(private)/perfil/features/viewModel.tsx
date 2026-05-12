"use client";

import { useActionState, startTransition, useEffect } from "react";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { alterarSenhaSchema, perfilSchema } from "./schema";
import { alterarSenha, atualizarPerfil } from "./actions";
import type { ActionState, AlterarSenhaFormData, PerfilFormData, PerfilInitialData } from "./model";

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
};

export function usePerfilViewModel({ initialData }: { initialData: PerfilInitialData }): PerfilViewModel {
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

  const onSubmitSenha: SubmitHandler<AlterarSenhaFormData> = (data) => {
    const formData = new FormData();
    formData.append("new_password", data.new_password);
    formData.append("confirm_password", data.confirm_password);
    startTransition(() => formActionSenha(formData));
  };

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
  };
}