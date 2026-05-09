"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useRef } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState } from "@/lib/supabase/types";
import { criarAula } from "./actions";
import { type AulaFormData, aulaSchema } from "./schema";

type NovaAulaViewModel = {
  form: UseFormReturn<AulaFormData>;
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useNovaAulaViewModel(cursoId: string): NovaAulaViewModel {
  const router = useRouter();
  const criarAulaComCursoId = criarAula.bind(null, cursoId);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    criarAulaComCursoId,
    undefined,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<AulaFormData>({
    resolver: zodResolver(aulaSchema),
    defaultValues: {
      title: "",
      video_url: "",
      material_url: "",
      is_published: false,
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    const el = formRef.current;
    if (!el) return;
    startTransition(() => {
      formAction(new FormData(el));
    });
  });

  function handleCancel() {
    router.back();
  }

  return { form, formRef, handleSubmit, isPending, state, handleCancel };
}
