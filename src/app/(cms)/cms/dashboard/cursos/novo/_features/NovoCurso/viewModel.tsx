"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useRef } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState } from "@/lib/supabase/types";
import { criarCurso } from "./actions";
import { type CursoFormData, cursoSchema } from "./schema";

type NovoCursoViewModel = {
  form: UseFormReturn<CursoFormData>;
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useNovoCursoViewModel(): NovoCursoViewModel {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    criarCurso,
    undefined,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      title: "",
      description: "",
      price_cents: "",
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
