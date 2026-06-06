"use client"

import { startTransition, useActionState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { criarAula } from "./actions"
import { aulaSchema, type AulaFormData } from "./schema"

export function useNovaAulaViewModel(cursoId: string) {
  const boundAction = criarAula.bind(null, cursoId)
  const [state, formAction, isPending] = useActionState(boundAction, undefined)

  const form = useForm<AulaFormData>({
    resolver: zodResolver(aulaSchema),
    defaultValues: {
      title: "",
      video_url: "",
      position: 0,
      duration_seconds: undefined,
      is_published: false,
    },
  })

  const onSubmit: SubmitHandler<AulaFormData> = (data) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("video_url", data.video_url ?? "")
    formData.append("position", String(data.position))
    if (data.duration_seconds !== undefined) {
      formData.append("duration_seconds", String(data.duration_seconds))
    }
    formData.append("is_published", String(data.is_published))
    startTransition(() => formAction(formData))
  }

  return { form, onSubmit, state, isPending }
}
