"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState } from "@/lib/supabase/types";
import { criarEvento } from "./actions";
import { type EventoFormData, eventoSchema } from "./schema";

type NovoEventoViewModel = {
  form: UseFormReturn<EventoFormData>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useNovoEventoViewModel(): NovoEventoViewModel {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    criarEvento,
    undefined,
  );

  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      title: "",
      description: "",
      long_description: "",
      type: "ao_vivo",
      status: "draft",
      scheduled_at: "",
      youtube_url: "",
    },
  });

  function handleCancel() {
    router.back();
  }

  return { form, formAction, isPending, state, handleCancel };
}
