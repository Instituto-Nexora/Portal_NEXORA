"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import {
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";
import type { ActionState } from "@/lib/supabase/types";
import { login } from "./actions";
import type { LoginFormData } from "./model";
import { loginSchema } from "./schema";

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
