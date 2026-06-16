"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { useLoginViewModel } from "./viewModel";

export default function LoginView() {
  const { form, onSubmit, status, isPending } = useLoginViewModel();

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <div
      className={cn(
        "max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-200",
      )}
    >
      <div className={cn("mb-8 text-center")}>
        <h2 className={cn("text-2xl font-bold text-teal-900")}>
          Bem-vindo de volta
        </h2>
        <p className={cn("text-slate-500 mt-2 text-sm")}>
          Entre para acessar seus cursos e materiais.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-5")}
      >
        <div className={cn("flex flex-col gap-2")}>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className={cn("text-sm text-destructive")}>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className={cn("flex flex-col gap-2")}>
          <div className={cn("flex justify-between items-center")}>
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/recuperar-senha"
              className={cn(
                "text-xs text-teal-600 hover:text-teal-700 font-medium",
              )}
            >
              Esqueceu a senha?
            </Link>
          </div>
          <PasswordInput
            id="password"
            disabled={isLoading}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className={cn("text-sm text-destructive")}>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {status && (
          <div
            className={cn(
              "p-3 rounded-md",
              status.success
                ? "bg-teal-50 text-teal-800"
                : "bg-red-50 text-red-800",
            )}
          >
            <p className={cn("text-sm font-medium text-center")}>
              {status.message}
            </p>
          </div>
        )}

        <div className={cn("pt-2")}>
          <Button
            type="submit"
            disabled={isLoading}
            className={cn("w-full bg-teal-600 hover:bg-teal-700")}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>

      <div className={cn("mt-6 text-center")}>
        <p className={cn("text-sm text-slate-600")}>
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className={cn(
              "text-amber-600 hover:text-amber-700 font-semibold transition-colors",
            )}
          >
            Cadastrar &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
