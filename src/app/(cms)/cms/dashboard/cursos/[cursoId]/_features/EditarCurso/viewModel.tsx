"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import type { ActionState, Curso } from "@/lib/supabase/types";
import { editarCurso } from "./actions";
import { type CursoFormData, cursoSchema } from "./schema";

type EditarCursoViewModel = {
  form: UseFormReturn<CursoFormData>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  state: ActionState;
  handleCancel: () => void;
};

export function useEditarCursoViewModel(
  curso: Curso,
): EditarCursoViewModel {
  const router = useRouter();

  const editarCursoComId = editarCurso.bind(null, curso.id);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    editarCursoComId,
    undefined,
  );

  const form = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      title: curso.title,
      description: curso.description,
      price_cents: curso.price_cents?.toString() ?? "",
      is_published: curso.is_published,
    },
  });

  function handleCancel() {
    router.back();
  }

  return { form, formAction, isPending, state, handleCancel };
}
