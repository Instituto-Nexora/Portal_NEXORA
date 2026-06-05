"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { signIn } from "./actions";
import { type LoginFormData, loginSchema } from "./schema";

export function LoginView() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    signIn,
    undefined,
  );

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className={cn("min-h-screen flex")}>
      {/* Left column — form */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-center px-8 py-12 lg:px-16",
        )}
      >
        <div className={cn("mx-auto w-full max-w-sm")}>
          <h1 className={cn("text-2xl font-bold tracking-tight mb-2")}>
            Acessar o CMS
          </h1>
          <p className={cn("text-sm text-muted-foreground mb-8")}>
            Entre com suas credenciais de administrador.
          </p>

          <form action={formAction} className={cn("space-y-5")}>
            <div className={cn("space-y-1.5")}>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@nexora.com"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  errors.email || state?.errors?.email
                    ? "border-destructive"
                    : "",
                )}
              />
              {(errors.email || state?.errors?.email) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.email?.message ?? state?.errors?.email?.[0]}
                </p>
              )}
            </div>

            <div className={cn("space-y-1.5")}>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={cn(
                  errors.password || state?.errors?.password
                    ? "border-destructive"
                    : "",
                )}
              />
              {(errors.password || state?.errors?.password) && (
                <p className={cn("text-xs text-destructive")}>
                  {errors.password?.message ?? state?.errors?.password?.[0]}
                </p>
              )}
            </div>

            {state?.message && (
              <p className={cn("text-sm text-destructive")}>{state.message}</p>
            )}

            <Button type="submit" className={cn("w-full")} disabled={isPending}>
              {isPending ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right column — branding (desktop only) */}
      <div
        className={cn(
          "hidden lg:flex flex-1 items-center justify-center bg-primary",
        )}
      >
        <span
          className={cn(
            "text-4xl font-bold text-primary-foreground tracking-widest",
          )}
        >
          NEXORA
        </span>
      </div>
    </div>
  );
}
