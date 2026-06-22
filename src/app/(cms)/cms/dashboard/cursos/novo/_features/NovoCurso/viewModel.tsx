"use client"

import { startTransition, useActionState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { criarCurso } from "./actions"
import { cursoSchema, type CursoFormData } from "./schema"

export function useNovoCursoViewModel() {
  const [state, formAction, isPending] = useActionState(criarCurso, undefined)

  const form = useForm<CursoFormData>({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail_url: "",
      price_cents: 0,
      is_published: false,
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
