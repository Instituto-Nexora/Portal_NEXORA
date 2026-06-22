"use client"

import { startTransition, useActionState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Aula } from "@/lib/supabase/types"
import { atualizarAula } from "./actions"
import { aulaSchema, type AulaFormData } from "@/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/schema"

export function useEditarAulaViewModel(aula: Aula) {
  const boundAction = atualizarAula.bind(null, aula.course_id, aula.id)
  const [state, formAction, isPending] = useActionState(boundAction, undefined)

  const form = useForm<AulaFormData>({
    resolver: zodResolver(aulaSchema),
    defaultValues: {
      title: aula.title,
      video_url: aula.video_url ?? "",
      position: aula.position,
      duration_seconds: aula.duration_seconds ?? undefined,
      is_published: aula.is_published,
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
