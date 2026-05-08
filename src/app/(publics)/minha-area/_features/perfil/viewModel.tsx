"use client";

import { useState } from "react";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { perfilSchema, alterarSenhaSchema } from "./schema";
import { atualizarPerfil, alterarSenha } from "./actions";
import type { ActionState, StudentProfile, PerfilFormData, AlterarSenhaFormData } from "./model";

export type PerfilViewModel = {
  perfilForm: UseFormReturn<PerfilFormData>;
  senhaForm: UseFormReturn<AlterarSenhaFormData>;
  onPerfilSubmit: SubmitHandler<PerfilFormData>;
  onSenhaSubmit: SubmitHandler<AlterarSenhaFormData>;
  perfilStatus: ActionState | null;
  senhaStatus: ActionState | null;
};

export function usePerfilViewModel(initialData: StudentProfile): PerfilViewModel {
  const [perfilStatus, setPerfilStatus] = useState<ActionState | null>(null);
  const [senhaStatus, setSenhaStatus] = useState<ActionState | null>(null);

  const perfilForm = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { full_name: initialData.full_name },
  });

  const senhaForm = useForm<AlterarSenhaFormData>({
    resolver: zodResolver(alterarSenhaSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const onPerfilSubmit: SubmitHandler<PerfilFormData> = async (data) => {
    setPerfilStatus(null);
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    const result = await atualizarPerfil(null, formData);
    setPerfilStatus(result);
  };

  const onSenhaSubmit: SubmitHandler<AlterarSenhaFormData> = async (data) => {
    setSenhaStatus(null);
    const formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("new_password", data.new_password);
    const result = await alterarSenha(formData);
    setSenhaStatus(result);
    if (result.success) senhaForm.reset();
  };

  return { perfilForm, senhaForm, onPerfilSubmit, onSenhaSubmit, perfilStatus, senhaStatus };
}