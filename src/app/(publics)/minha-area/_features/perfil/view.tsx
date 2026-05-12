"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePerfilViewModel } from "./viewModel";
import { StudentProfile } from '@/lib/supabase/types';
import Link from "next/link";

type PerfilViewProps = {
  initialData: StudentProfile;
};

export default function PerfilView({ initialData }: PerfilViewProps) {
  const {
    perfilForm,
    senhaForm,
    onPerfilSubmit,
    onSenhaSubmit,
    perfilStatus,
    senhaStatus,
  } = usePerfilViewModel(initialData);

  const dataCadastro = new Date(initialData.created_at).toLocaleDateString("pt-BR");

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8")}>
      <div className={cn("lg:col-span-2 flex flex-col gap-6")}>
        {/* Bloco 1: Dados Pessoais */}
        <section className={cn("bg-white p-6 rounded-lg shadow-sm border")}>
          <h2 className={cn("text-xl font-semibold mb-6")}>Dados Pessoais</h2>
          <form onSubmit={perfilForm.handleSubmit(onPerfilSubmit)} className={cn("flex flex-col gap-4")}>
            <div className={cn("flex flex-col gap-2")}>
              <Label htmlFor="email">E-mail (Acesso)</Label>
              <Input
                id="email"
                type="email"
                value={initialData.email}
                readOnly
                disabled
                className={cn("bg-slate-50 cursor-not-allowed")}
              />
              <p className={cn("text-xs text-slate-500")}>Sua conta foi criada em {dataCadastro}</p>
            </div>
            <div className={cn("flex flex-col gap-2")}>
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input id="full_name" {...perfilForm.register("full_name")} />
              {perfilForm.formState.errors.full_name && (
                <p className={cn("text-sm text-destructive")}>{perfilForm.formState.errors.full_name.message}</p>
              )}
            </div>
            {perfilStatus && (
              <p className={cn("text-sm font-medium", perfilStatus.success ? "text-green-600" : "text-destructive")}>
                {perfilStatus.message}
              </p>
            )}
            <div className={cn("pt-2")}>
              <Button type="submit" disabled={perfilForm.formState.isSubmitting}>
                {perfilForm.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </section>

        {/* Bloco 2: Segurança */}
        <section className={cn("bg-white p-6 rounded-lg shadow-sm border")}>
          <h2 className={cn("text-xl font-semibold mb-6")}>Segurança e Senha</h2>
          <form onSubmit={senhaForm.handleSubmit(onSenhaSubmit)} className={cn("flex flex-col gap-4")}>
            <div className={cn("flex flex-col gap-2")}>
              <Label htmlFor="current_password">Senha Atual</Label>
              <Input id="current_password" type="password" {...senhaForm.register("current_password")} />
              {senhaForm.formState.errors.current_password && (
                <p className={cn("text-sm text-destructive")}>{senhaForm.formState.errors.current_password.message}</p>
              )}
            </div>
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}>
              <div className={cn("flex flex-col gap-2")}>
                <Label htmlFor="new_password">Nova Senha</Label>
                <Input id="new_password" type="password" {...senhaForm.register("new_password")} />
                {senhaForm.formState.errors.new_password && (
                  <p className={cn("text-sm text-destructive")}>{senhaForm.formState.errors.new_password.message}</p>
                )}
              </div>
              <div className={cn("flex flex-col gap-2")}>
                <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                <Input id="confirm_password" type="password" {...senhaForm.register("confirm_password")} />
                {senhaForm.formState.errors.confirm_password && (
                  <p className={cn("text-sm text-destructive")}>{senhaForm.formState.errors.confirm_password.message}</p>
                )}
              </div>
            </div>
            {senhaStatus && (
              <p className={cn("text-sm font-medium", senhaStatus.success ? "text-green-600" : "text-destructive")}>
                {senhaStatus.message}
              </p>
            )}
            <div className={cn("pt-2")}>
              <Button type="submit" variant="secondary" disabled={senhaForm.formState.isSubmitting}>
                {senhaForm.formState.isSubmitting ? "Atualizando Senha..." : "Atualizar Senha"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}