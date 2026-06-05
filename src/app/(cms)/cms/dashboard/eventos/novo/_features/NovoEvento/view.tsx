"use client";

import { Controller } from "react-hook-form";
import { ThumbnailUpload } from "@/components/cms/ThumbnailUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNovoEventoViewModel } from "./viewModel";

export function NovoEventoView() {
  const { form, formRef, handleSubmit, isPending, state, handleCancel } =
    useNovoEventoViewModel();
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const tipo = watch("type");

  return (
    <div className={cn("mx-auto max-w-2xl py-8 px-4")}>
      <h1 className={cn("text-2xl font-bold tracking-tight mb-1")}>
        Novo evento
      </h1>
      <p className={cn("text-sm text-muted-foreground mb-8")}>
        Preencha os dados do evento. O slug será gerado automaticamente a partir
        do título.
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-6")}>
        {/* Informações básicas */}
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
                placeholder="Ex: Live de Segurança Digital"
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
              <Label htmlFor="description">Descrição curta</Label>
              <Input
                id="description"
                type="text"
                placeholder="Resumo do evento"
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

            <div className={cn("space-y-1.5")}>
              <Label htmlFor="long_description">
                Descrição longa (opcional)
              </Label>
              <Textarea
                id="long_description"
                rows={4}
                placeholder="Detalhes completos do evento..."
                {...register("long_description")}
                className={cn({
                  "border-destructive":
                    errors.long_description || state?.errors?.long_description,
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("grid grid-cols-2 gap-4")}>
              <div className={cn("space-y-1.5")}>
                <Label htmlFor="type">Tipo</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <>
                      <input type="hidden" name="type" value={field.value} />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="type"
                          className={cn({
                            "border-destructive":
                              errors.type || state?.errors?.type,
                          })}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ao_vivo">Ao Vivo</SelectItem>
                          <SelectItem value="gravado">Gravado</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                />
                {(errors.type || state?.errors?.type) && (
                  <p className={cn("text-xs text-destructive")}>
                    {errors.type?.message ?? state?.errors?.type?.[0]}
                  </p>
                )}
              </div>

              <div className={cn("space-y-1.5")}>
                <Label htmlFor="status">Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <>
                      <input type="hidden" name="status" value={field.value} />
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="status"
                          className={cn({
                            "border-destructive":
                              errors.status || state?.errors?.status,
                          })}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                />
              </div>
            </div>

            {tipo === "ao_vivo" && (
              <div className={cn("space-y-1.5")}>
                <Label htmlFor="scheduled_at">Data e hora</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  {...register("scheduled_at")}
                  className={cn({
                    "border-destructive":
                      errors.scheduled_at || state?.errors?.scheduled_at,
                  })}
                />
                {(errors.scheduled_at || state?.errors?.scheduled_at) && (
                  <p className={cn("text-xs text-destructive")}>
                    {errors.scheduled_at?.message ??
                      state?.errors?.scheduled_at?.[0]}
                  </p>
                )}
              </div>
            )}

            <div className={cn("space-y-1.5")}>
              <div className={cn("flex items-center gap-1.5")}>
                <Label htmlFor="duration_minutes">
                  Duração (minutos, opcional)
                </Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    className={cn(
                      "text-muted-foreground hover:text-foreground text-xs",
                    )}
                  >
                    ⓘ
                  </TooltipTrigger>
                  <TooltipContent>Duração estimada em minutos</TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="duration_minutes"
                type="number"
                min={1}
                placeholder="60"
                {...register("duration_minutes")}
                className={cn({
                  "border-destructive":
                    errors.duration_minutes || state?.errors?.duration_minutes,
                })}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Mídia */}
        <Card>
          <CardHeader>
            <CardTitle>Mídia</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label>Thumbnail</Label>
              <ThumbnailUpload />
              {state?.errors?.thumbnail_file && (
                <p className={cn("text-xs text-destructive")}>
                  {state.errors.thumbnail_file[0]}
                </p>
              )}
            </div>

            <div className={cn("space-y-1.5")}>
              <div className={cn("flex items-center gap-1.5")}>
                <Label htmlFor="youtube_url">URL do YouTube (opcional)</Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    className={cn(
                      "text-muted-foreground hover:text-foreground text-xs",
                    )}
                  >
                    ⓘ
                  </TooltipTrigger>
                  <TooltipContent>
                    Aceita links do YouTube Watch, youtu.be e transmissões ao
                    vivo
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="youtube_url"
                type="url"
                placeholder="https://youtube.com/..."
                {...register("youtube_url")}
                className={cn({
                  "border-destructive":
                    errors.youtube_url || state?.errors?.youtube_url,
                })}
              />
              {(errors.youtube_url || state?.errors?.youtube_url) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.youtube_url?.message ??
                    state?.errors?.youtube_url?.[0]}
                </p>
              )}
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
            {isPending ? "Criando evento…" : "Criar evento"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
