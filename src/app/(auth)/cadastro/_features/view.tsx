"use client";

import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils"; // Ajuste conforme seu helper
import { useCadastroViewModel } from "./viewModel";

export const CadastroView = () => {
  const { form, state, formAction, isPending } = useCadastroViewModel();

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-slate-50 p-4",
      )}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm",
        )}
      >
        <h1 className={cn("mb-6 text-2xl font-bold text-teal-700")}>
          Criar conta
        </h1>

        <form action={formAction} className={cn("space-y-4")}>
          <div className={cn("space-y-1")}>
            <label
              htmlFor="full_name"
              className={cn("text-sm font-medium text-slate-700")}
            >
              Nome Completo
            </label>
            <input
              id="full_name"
              {...form.register("full_name")}
              name="full_name"
              className={cn(
                "w-full rounded-md border border-slate-300 p-2 focus:border-teal-500 focus:ring-teal-500",
              )}
            />
            {form.formState.errors.full_name && (
              <p className={cn("text-xs text-red-500")}>
                {form.formState.errors.full_name.message}
              </p>
            )}
          </div>

          <div className={cn("space-y-1")}>
            <label
              htmlFor="email"
              className={cn("text-sm font-medium text-slate-700")}
            >
              E-mail
            </label>
            <input
              id="email"
              {...form.register("email")}
              name="email"
              type="email"
              className={cn(
                "w-full rounded-md border border-slate-300 p-2 focus:border-teal-500 focus:ring-teal-500",
              )}
            />
            {form.formState.errors.email && (
              <p className={cn("text-xs text-red-500")}>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className={cn("space-y-1")}>
            <label
              htmlFor="password"
              className={cn("text-sm font-medium text-slate-700")}
            >
              Senha
            </label>
            <PasswordInput
              id="password"
              {...form.register("password")}
              name="password"
            />
            {form.formState.errors.password && (
              <p className={cn("text-xs text-red-500")}>
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className={cn("space-y-1")}>
            <label
              htmlFor="confirm_password"
              className={cn("text-sm font-medium text-slate-700")}
            >
              Confirmar Senha
            </label>
            <PasswordInput
              id="confirm_password"
              {...form.register("confirm_password")}
              name="confirm_password"
            />
            {form.formState.errors.confirm_password && (
              <p className={cn("text-xs text-red-500")}>
                {form.formState.errors.confirm_password.message}
              </p>
            )}
          </div>

          {state?.message && (
            <p
              className={cn(
                "text-sm p-3 rounded",
                state.success
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800",
              )}
            >
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full rounded-md bg-teal-600 py-2 font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed",
              "bg-teal-600 hover:bg-teal-700 active:bg-teal-800",
            )}
          >
            {isPending ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className={cn("mt-6 text-center text-sm text-slate-600")}>
          Já tem conta?{" "}
          <Link
            href="/login"
            className={cn("font-medium text-amber-600 hover:text-amber-700")}
          >
            Entrar →
          </Link>
        </p>
      </div>
    </div>
  );
};
