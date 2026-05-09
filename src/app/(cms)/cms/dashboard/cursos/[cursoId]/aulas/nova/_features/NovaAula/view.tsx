"use client";

import { Controller } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNovaAulaViewModel } from "./viewModel";

type Props = {
  cursoId: string;
};

export function NovaAulaView({ cursoId }: Props) {
  const { form, formRef, handleSubmit, isPending, state, handleCancel } =
    useNovaAulaViewModel(cursoId);
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className={cn("mx-auto max-w-2xl py-8 px-4")}>
      <h1 className={cn("text-2xl font-bold tracking-tight mb-1")}>
        Nova aula
      </h1>
      <p className={cn("text-sm text-muted-foreground mb-8")}>
        Preencha os dados da aula. A posição será atribuída automaticamente.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-6")}>
        <Card>
          <CardHeader>
            <CardTitle>Informações da aula</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Introdução ao React"
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
              <Label htmlFor="video_url">URL do vídeo (opcional)</Label>
              <Input
                id="video_url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                {...register("video_url")}
                className={cn({
                  "border-destructive":
                    errors.video_url || state?.errors?.video_url,
                })}
              />
              {(errors.video_url || state?.errors?.video_url) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.video_url?.message ?? state?.errors?.video_url?.[0]}
                </p>
              )}
            </div>

            <div className={cn("space-y-1.5")}>
              <Label htmlFor="material_url">URL do material (opcional)</Label>
              <Input
                id="material_url"
                type="url"
                placeholder="https://drive.google.com/..."
                {...register("material_url")}
                className={cn({
                  "border-destructive":
                    errors.material_url || state?.errors?.material_url,
                })}
              />
              {(errors.material_url || state?.errors?.material_url) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.material_url?.message ??
                    state?.errors?.material_url?.[0]}
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
              <Label htmlFor="is_published">Aula publicada</Label>
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
            {isPending ? "Criando aula…" : "Criar aula"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
