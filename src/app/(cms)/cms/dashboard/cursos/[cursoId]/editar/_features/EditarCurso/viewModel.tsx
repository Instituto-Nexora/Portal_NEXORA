"use client"

import { startTransition, useActionState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Curso } from "@/lib/supabase/types"
import { atualizarCurso } from "./actions"
import { cursoSchema, type CursoFormData } from "@/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/schema"

export function useEditarCursoViewModel(curso: Curso) {
  const boundAction = atualizarCurso.bind(null, curso.id)
  const [state, formAction, isPending] = useActionState(boundAction, undefined)

  const form = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      title: curso.title,
      description: curso.description ?? "",
      thumbnail_url: curso.thumbnail_url ?? "",
      price_cents: curso.price_cents,
      is_published: curso.is_published,
    },
  })

  const onSubmit: SubmitHandler<CursoFormData> = (data) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description ?? "")
    formData.append("thumbnail_url", data.thumbnail_url ?? "")
    formData.append("price_cents", String(data.price_cents))
    formData.append("is_published", String(data.is_published))
    startTransition(() => formAction(formData))
  }

  return { form, onSubmit, state, isPending }
}
