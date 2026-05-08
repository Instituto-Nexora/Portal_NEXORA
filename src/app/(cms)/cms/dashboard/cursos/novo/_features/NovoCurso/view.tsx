"use client";

import { Controller } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNovoCursoViewModel } from "./viewModel";

export function NovoCursoView() {
  const { form, formRef, handleSubmit, isPending, state, handleCancel } =
    useNovoCursoViewModel();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className={cn("mx-auto max-w-2xl py-8 px-4")}>
      <h1 className={cn("text-2xl font-bold tracking-tight mb-1")}>
        Novo curso
      </h1>
      <p className={cn("text-sm text-muted-foreground mb-8")}>
        Preencha os dados do curso. O slug será gerado automaticamente a partir
        do título.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Informações básicas</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: React do Zero ao Avançado"
                {...register("title")}
                className={cn({
                  "border-destructive": errors.title || state?.errors?.title,
                })}
              />
              {(errors.title || state?.errors?.title) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.title?.message ?? state?.errors?.title?.[0]}
                </p>
              )}
            </div>

            <div className={cn("space-y-1.5")}>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Descrição do curso"
                {...register("description")}
                className={cn({
                  "border-destructive":
                    errors.description || state?.errors?.description,
                })}
              />
              {(errors.description || state?.errors?.description) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.description?.message ??
                    state?.errors?.description?.[0]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Preço</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="price_cents">Preço (em centavos)</Label>
              <Input
                id="price_cents"
                type="number"
                min={0}
                step={1}
                placeholder="Ex: 4990 para R$ 49,90"
                {...register("price_cents")}
                className={cn({
                  "border-destructive":
                    errors.price_cents || state?.errors?.price_cents,
                })}
              />
              <p className={cn("text-xs text-muted-foreground")}>
                Valor em centavos. Ex: 4990 = R$ 49,90
              </p>
              {(errors.price_cents || state?.errors?.price_cents) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.price_cents?.message ??
                    state?.errors?.price_cents?.[0]}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Publicação</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("flex items-center gap-3")}>
              <Controller
                control={control}
                name="is_published"
                render={({ field }) => (
                  <>
                    <input
                      type="hidden"
                      name="is_published"
                      value={String(field.value)}
                    />
                    <Switch
                      id="is_published"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </>
                )}
              />
              <Label htmlFor="is_published">Curso publicado</Label>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Thumbnail</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="thumbnail_file">Imagem de capa (opcional)</Label>
              <Input
                id="thumbnail_file"
                name="thumbnail_file"
                type="file"
                accept="image/*"
              />
            </div>
          </CardContent>
        </Card>

        {state?.message && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <div className={cn("flex gap-3 pt-2")}>
          <Button type="submit" disabled={isPending} className={cn("flex-1")}>
            {isPending ? "Criando curso…" : "Criar curso"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
