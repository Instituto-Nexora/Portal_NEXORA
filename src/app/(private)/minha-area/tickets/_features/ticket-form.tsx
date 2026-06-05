"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type TicketFormValues,
  ticketTopicoLabels,
  ticketTopicoValues,
} from "./ticket-schema";

type Props = {
  form: UseFormReturn<TicketFormValues>;
  isPending: boolean;
};

export function TicketForm({ form, isPending }: Props) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <>
      {errors.root && (
        <div
          className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg border border-destructive/20"
          role="alert"
        >
          {errors.root.message}
        </div>
      )}

      <div className="space-y-2">
        <Label id="topico-label">Assunto / Tópico</Label>
        <Controller
          control={control}
          name="topico"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isPending}
            >
              <SelectTrigger
                aria-labelledby="topico-label"
                size="default"
                className="h-10 w-full"
                aria-invalid={!!errors.topico}
              >
                <SelectValue placeholder="Selecione o assunto relacionado..." />
              </SelectTrigger>
              <SelectContent>
                {ticketTopicoValues.map((v) => (
                  <SelectItem key={v} value={v}>
                    {ticketTopicoLabels[v]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.topico && (
          <p className="text-xs text-destructive font-medium">
            {errors.topico.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensagem">Sua Mensagem</Label>
        <Textarea
          id="mensagem"
          rows={6}
          className="min-h-30 resize-y"
          placeholder="Descreva detalhadamente como podemos te ajudar..."
          {...register("mensagem")}
          disabled={isPending}
          aria-invalid={!!errors.mensagem}
        />
        {errors.mensagem && (
          <p className="text-xs text-destructive font-medium">
            {errors.mensagem.message}
          </p>
        )}
      </div>
    </>
  );
}
