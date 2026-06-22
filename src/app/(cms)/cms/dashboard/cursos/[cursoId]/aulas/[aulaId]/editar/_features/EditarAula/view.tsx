"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { Aula } from "@/lib/supabase/types"
import { useEditarAulaViewModel } from "./viewModel"

type Props = {
  aula: Aula
}

export function EditarAulaView({ aula }: Props) {
  const { form, onSubmit, isPending, state } = useEditarAulaViewModel(aula)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  return (
    <div className={cn("p-6 max-w-2xl mx-auto space-y-6")}>
      <div className={cn("flex items-center gap-3")}>
        <Link href={`/cms/dashboard/cursos/${aula.course_id}`}>
          <Button variant="ghost" size="sm" aria-label="Voltar para lista de aulas">
            <ArrowLeft className={cn("w-4 h-4")} aria-hidden="true" />
          </Button>
        </Link>
        <div>
          <h1 className={cn("text-2xl font-bold text-foreground")}>Editar Aula</h1>
          <p className={cn("text-sm text-muted-foreground truncate max-w-xs")}>{aula.title}</p>
        </div>
      </div>

      {state?.message && !state.success && (
        <p className={cn("text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md")} role="alert">
          {state.message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-5")}>
        <div className={cn("space-y-1.5")}>
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Nome da aula"
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p id="title-error" className={cn("text-xs text-destructive")} role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className={cn("space-y-1.5")}>
          <Label htmlFor="video_url">URL do Vídeo</Label>
          <Input
            id="video_url"
            {...register("video_url")}
            placeholder="https://..."
            type="url"
            aria-describedby={errors.video_url ? "video-error" : undefined}
            aria-invalid={!!errors.video_url}
          />
          {errors.video_url && (
            <p id="video-error" className={cn("text-xs text-destructive")} role="alert">
              {errors.video_url.message}
            </p>
          )}
        </div>

        <div className={cn("grid grid-cols-2 gap-4")}>
          <div className={cn("space-y-1.5")}>
            <Label htmlFor="position">Posição *</Label>
            <Input
              id="position"
              {...register("position", { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="0"
              aria-describedby={errors.position ? "position-error" : undefined}
              aria-invalid={!!errors.position}
            />
            {errors.position && (
              <p id="position-error" className={cn("text-xs text-destructive")} role="alert">
                {errors.position.message}
              </p>
            )}
          </div>

          <div className={cn("space-y-1.5")}>
            <Label htmlFor="duration_seconds">Duração (segundos)</Label>
            <Input
              id="duration_seconds"
              {...register("duration_seconds", { valueAsNumber: true })}
              type="number"
              min={0}
              placeholder="ex: 3600 = 1h"
              aria-describedby={errors.duration_seconds ? "duration-error" : "duration-hint"}
              aria-invalid={!!errors.duration_seconds}
            />
            <p id="duration-hint" className={cn("text-xs text-muted-foreground")}>
              Opcional. Ex: 3600 = 1 hora
            </p>
            {errors.duration_seconds && (
              <p id="duration-error" className={cn("text-xs text-destructive")} role="alert">
                {errors.duration_seconds.message}
              </p>
            )}
          </div>
        </div>

        <div className={cn("flex items-center gap-3 py-1")}>
          <input
            id="is_published_checkbox"
            type="checkbox"
            className={cn("h-4 w-4 rounded border-border accent-primary")}
            checked={watch("is_published")}
            onChange={(e) => setValue("is_published", e.target.checked)}
            aria-label="Aula publicada"
          />
          <Label htmlFor="is_published_checkbox" className={cn("cursor-pointer font-normal")}>
            Aula publicada
          </Label>
        </div>

        <div className={cn("flex gap-3 pt-2")}>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href={`/cms/dashboard/cursos/${aula.course_id}`}>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
