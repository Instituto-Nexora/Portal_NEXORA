<<<<<<< HEAD
"use client";

import { Controller } from "react-hook-form";
import { ThumbnailUpload } from "@/components/cms/ThumbnailUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Event } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { DeleteEventoDialog } from "../DeleteEventoDialog/view";
import { useEditarEventoViewModel } from "./viewModel";

type Props = {
  evento: Event;
};

export function EditarEventoView({ evento }: Props) {
  const { form, formAction, isPending, state, handleCancel } =
    useEditarEventoViewModel(evento);
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const tipo = watch("type");

  return (
    <div className={cn("mx-auto max-w-2xl py-8 px-4")}>
      <div className={cn("flex items-start justify-between mb-8")}>
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight mb-1")}>
            Editar evento
          </h1>
          <div className={cn("flex items-center gap-2")}>
            <span className={cn("text-sm text-muted-foreground")}>Slug:</span>
            <Badge variant="secondary">
              <code className={cn("font-mono text-xs")}>{evento.slug}</code>
            </Badge>
          </div>
        </div>
        <DeleteEventoDialog eventoId={evento.id} eventoTitle={evento.title} />
      </div>

      <form action={formAction} className={cn("space-y-6")}>
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
                {...register("long_description")}
                className={cn({
                  "border-destructive":
                    errors.long_description ||
                    state?.errors?.long_description,
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
                  <TooltipContent>
                    Duração estimada em minutos
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="duration_minutes"
                type="number"
                min={1}
                {...register("duration_minutes")}
                className={cn({
                  "border-destructive":
                    errors.duration_minutes ||
                    state?.errors?.duration_minutes,
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
              <ThumbnailUpload initialUrl={evento.thumbnail_url} />
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
            {isPending ? "Salvando…" : "Salvar alterações"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
=======
"use client";

import { Controller } from "react-hook-form";
import { ThumbnailUpload } from "@/components/cms/ThumbnailUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import type { Event } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { DeleteEventoDialog } from "../DeleteEventoDialog/view";
import { useEditarEventoViewModel } from "./viewModel";

type Props = {
  evento: Event;
};

export function EditarEventoView({ evento }: Props) {
  const { form, formAction, isPending, state, handleCancel } =
    useEditarEventoViewModel(evento);
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;

  const tipo = watch("type");

  return (
    <div className={cn("mx-auto w-full max-w-4xl px-0 py-4 sm:py-8")}>
      <div
        className={cn(
          "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between",
        )}
      >
        <div>
          <h1
            className={cn("mb-1 text-2xl font-bold tracking-tight sm:text-3xl")}
          >
            Editar evento
          </h1>
          <div className={cn("flex min-w-0 flex-wrap items-center gap-2")}>
            <span className={cn("text-sm text-muted-foreground")}>Slug:</span>
            <Badge variant="secondary" className={cn("max-w-full")}>
              <code className={cn("truncate font-mono text-xs")}>
                {evento.slug}
              </code>
            </Badge>
          </div>
        </div>
        <DeleteEventoDialog eventoId={evento.id} eventoTitle={evento.title} />
      </div>

      <form action={formAction} className={cn("space-y-6")}>
        {/* Informações básicas */}
        <Card className={cn("overflow-hidden")}>
          <CardHeader>
            <CardTitle>Informações básicas</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
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
                rows={5}
                {...register("long_description")}
                className={cn([
                  "min-h-32 resize-y",
                  {
                    "border-destructive":
                      errors.long_description ||
                      state?.errors?.long_description,
                  },
                ])}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Configurações */}
        <Card className={cn("overflow-hidden")}>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("grid gap-4 sm:grid-cols-2")}>
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
        <Card className={cn("overflow-hidden")}>
          <CardHeader>
            <CardTitle>Mídia</CardTitle>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("space-y-1.5")}>
              <Label>Thumbnail</Label>
              <ThumbnailUpload initialUrl={evento.thumbnail_url} />
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

        <div
          className={cn(
            "sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t bg-background/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:border-t-0 sm:bg-transparent sm:px-0 sm:pt-2 sm:backdrop-blur-none",
          )}
        >
          <Button
            type="submit"
            disabled={isPending}
            className={cn("w-full sm:flex-1")}
          >
            {isPending ? "Salvando…" : "Salvar alterações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className={cn("w-full sm:w-auto")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
>>>>>>> 64ef9e8ab06449e6bcbb8ab83b7b28c267dd6d04
