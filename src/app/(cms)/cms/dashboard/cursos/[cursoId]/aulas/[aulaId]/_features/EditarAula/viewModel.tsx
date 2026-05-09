"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState, Lesson } from "@/lib/supabase/types";
import { atualizarAula } from "./actions";
import { type AulaFormData, aulaSchema } from "./schema";

type EditarAulaViewModel = {
  form: UseFormReturn<AulaFormData>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useEditarAulaViewModel(aula: Lesson): EditarAulaViewModel {
  const router = useRouter();

  const atualizarAulaComId = atualizarAula.bind(null, aula.id);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    atualizarAulaComId,
    undefined,
  );

  const form = useForm<AulaFormData>({
    resolver: zodResolver(aulaSchema),
    defaultValues: {
      title: aula.title,
      video_url: aula.video_url ?? "",
      material_url: aula.material_url ?? "",
      is_published: aula.is_published,
    },
  });

  function handleCancel() {
    router.back();
  }

  return { form, formAction, isPending, state, handleCancel };
}
