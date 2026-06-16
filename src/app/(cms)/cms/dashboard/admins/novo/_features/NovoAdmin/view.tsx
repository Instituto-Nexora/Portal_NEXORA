"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNovoAdminViewModel } from "./viewModel";

const ROLE_OPTIONS = [
  { value: "content_creator", label: "Content Creator" },
  { value: "professor", label: "Professor" },
  { value: "admin", label: "Admin" },
] as const;

export function NovoAdminView() {
  const { form, formAction, isPending, state, handleCancel } =
    useNovoAdminViewModel();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className={cn(["mx-auto max-w-lg py-8 px-4"])}>
      <h1 className={cn(["text-2xl font-bold tracking-tight mb-2"])}>
        Novo administrador
      </h1>
      <p className={cn(["text-sm text-muted-foreground mb-8"])}>
        Crie uma conta de acesso ao CMS para um novo membro da equipe.
      </p>

      <form action={formAction} className={cn(["space-y-5"])}>
        <div className={cn(["space-y-1.5"])}>
          <Label htmlFor="full_name">Nome completo</Label>
          <Input
            id="full_name"
            type="text"
            placeholder="João Silva"
            autoComplete="name"
            {...register("full_name")}
            className={cn([
              {
                "border-destructive":
                  errors.full_name || state?.errors?.full_name,
              },
            ])}
          />
          {(errors.full_name || state?.errors?.full_name) && (
            <p className={cn(["text-xs text-destructive"])}>
              {errors.full_name?.message ?? state?.errors?.full_name?.[0]}
            </p>
          )}
        </div>

        <div className={cn(["space-y-1.5"])}>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@nexora.com"
            autoComplete="email"
            {...register("email")}
            className={cn([
              { "border-destructive": errors.email || state?.errors?.email },
            ])}
          />
          {(errors.email || state?.errors?.email) && (
            <p className={cn(["text-xs text-destructive"])}>
              {errors.email?.message ?? state?.errors?.email?.[0]}
            </p>
          )}
        </div>

        <div className={cn(["space-y-1.5"])}>
          <Label htmlFor="password">Senha temporária</Label>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
            className={cn([
              {
                "border-destructive":
                  errors.password || state?.errors?.password,
              },
            ])}
          />
          {(errors.password || state?.errors?.password) && (
            <p className={cn(["text-xs text-destructive"])}>
              {errors.password?.message ?? state?.errors?.password?.[0]}
            </p>
          )}
        </div>

        <div className={cn(["space-y-1.5"])}>
          <Label htmlFor="confirm_password">Confirmar senha</Label>
          <PasswordInput
            id="confirm_password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("confirm_password")}
            className={cn([
              {
                "border-destructive":
                  errors.confirm_password || state?.errors?.confirm_password,
              },
            ])}
          />
          {(errors.confirm_password || state?.errors?.confirm_password) && (
            <p className={cn(["text-xs text-destructive"])}>
              {errors.confirm_password?.message ??
                state?.errors?.confirm_password?.[0]}
            </p>
          )}
        </div>

        <div className={cn(["space-y-1.5"])}>
          <Label htmlFor="role">Permissão</Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <>
                <input type="hidden" name="role" value={field.value} />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="role"
                    className={cn([
                      { "border-destructive": errors.role || state?.errors?.role },
                    ])}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          />
          {(errors.role || state?.errors?.role) && (
            <p className={cn(["text-xs text-destructive"])}>
              {errors.role?.message ?? state?.errors?.role?.[0]}
            </p>
          )}
        </div>

        {state?.message && (
          <p className={cn(["text-sm text-destructive"])}>{state.message}</p>
        )}

        <div className={cn(["flex gap-3 pt-2"])}>
          <Button type="submit" disabled={isPending} className={cn(["flex-1"])}>
            {isPending ? "Criando conta…" : "Criar administrador"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
