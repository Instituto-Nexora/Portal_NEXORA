"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { Curso } from "@/lib/supabase/types"
import { useEditarCursoViewModel } from "./viewModel"

type Props = {
  curso: Curso
}

export function EditarCursoView({ curso }: Props) {
  const { form, onSubmit, isPending, state } = useEditarCursoViewModel(curso)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  return (
    <div className={cn("p-6 max-w-2xl mx-auto space-y-6")}>
      <div className={cn("flex items-center gap-3")}>
        <Link href="/cms/dashboard/cursos">
          <Button variant="ghost" size="sm" aria-label="Voltar para lista de cursos">
            <ArrowLeft className={cn("w-4 h-4")} aria-hidden="true" />
          </Button>
        </Link>
        <div>
          <h1 className={cn("text-2xl font-bold text-foreground")}>Editar Curso</h1>
          <p className={cn("text-sm text-muted-foreground truncate max-w-xs")}>{curso.title}</p>
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
            placeholder="Nome do curso"
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
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Descreva o curso brevemente..."
            rows={3}
          />
        </div>

        <div className={cn("space-y-1.5")}>
          <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
          <Input
            id="thumbnail_url"
            {...register("thumbnail_url")}
            placeholder="https://..."
            type="url"
            aria-describedby={errors.thumbnail_url ? "thumbnail-error" : undefined}
            aria-invalid={!!errors.thumbnail_url}
          />
          {errors.thumbnail_url && (
            <p id="thumbnail-error" className={cn("text-xs text-destructive")} role="alert">
              {errors.thumbnail_url.message}
            </p>
          )}
        </div>

        <div className={cn("space-y-1.5")}>
          <Label htmlFor="price_cents">Preço (em centavos) *</Label>
          <Input
            id="price_cents"
            {...register("price_cents", { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="ex: 9700 = R$ 97,00"
            aria-describedby={errors.price_cents ? "price-error" : "price-hint"}
            aria-invalid={!!errors.price_cents}
          />
          <p id="price-hint" className={cn("text-xs text-muted-foreground")}>
            Informe em centavos. Ex: R$ 97,00 = 9700
          </p>
          {errors.price_cents && (
            <p id="price-error" className={cn("text-xs text-destructive")} role="alert">
              {errors.price_cents.message}
            </p>
          )}
        </div>

        <div className={cn("flex items-center gap-3 py-1")}>
          <input
            id="is_published_checkbox"
            type="checkbox"
            className={cn("h-4 w-4 rounded border-border accent-primary")}
            checked={watch("is_published")}
            onChange={(e) => setValue("is_published", e.target.checked)}
            aria-label="Curso publicado"
          />
          <Label htmlFor="is_published_checkbox" className={cn("cursor-pointer font-normal")}>
            Curso publicado
          </Label>
        </div>

        <div className={cn("flex gap-3 pt-2")}>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href="/cms/dashboard/cursos">
            <Button type="button" variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
