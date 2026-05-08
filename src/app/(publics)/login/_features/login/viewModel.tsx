"use client";

import { useActionState, startTransition } from "react";
import { useForm, type UseFormReturn, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { login } from "./actions";
import type { ActionState, LoginFormData } from "./model";

export type LoginViewModel = {
  form: UseFormReturn<LoginFormData>;
  onSubmit: SubmitHandler<LoginFormData>;
  status: ActionState | null;
  isPending: boolean;
};

export function useLoginViewModel(): LoginViewModel {
  const [status, formAction, isPending] = useActionState(login, null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    // Aciona a Server Action envelopada em uma transition para capturar isPending corretamente
    startTransition(() => formAction(formData));
  };

  return { form, onSubmit, status, isPending };
}