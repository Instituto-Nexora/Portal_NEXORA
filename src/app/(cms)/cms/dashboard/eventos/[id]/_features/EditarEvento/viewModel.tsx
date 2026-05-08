"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState, Event } from "@/lib/supabase/types";
import { editarEvento } from "./actions";
import { type EventoFormData, eventoSchema } from "./schema";

type EditarEventoViewModel = {
  form: UseFormReturn<EventoFormData>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useEditarEventoViewModel(evento: Event): EditarEventoViewModel {
  const router = useRouter();

  const editarEventoComId = editarEvento.bind(null, evento.id);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    editarEventoComId,
    undefined,
  );

  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      title: evento.title,
      description: evento.description,
      long_description: evento.long_description ?? "",
      type: evento.type,
      status: evento.status,
      scheduled_at: evento.scheduled_at
        ? new Date(evento.scheduled_at).toISOString().slice(0, 16)
        : "",
      duration_minutes: evento.duration_minutes?.toString() ?? "",
      youtube_url: evento.youtube_url ?? "",
    },
  });

  function handleCancel() {
    router.back();
  }

  return { form, formAction, isPending, state, handleCancel };
}
