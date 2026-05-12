"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePerfilViewModel } from "./viewModel";
import type { PerfilInitialData } from "./model";
import { Separator } from "@/components/ui/separator";

type PerfilViewProps = {
  initialData: PerfilInitialData;
};

export default function PerfilView({ initialData }: PerfilViewProps) {
  const {
    formPerfil,
    onSubmitPerfil,
    statusPerfil,
    isPendingPerfil,
    formSenha,
    onSubmitSenha,
    statusSenha,
    isPendingSenha,
  } = usePerfilViewModel({ initialData });

  const isLoadingPerfil = isPendingPerfil || formPerfil.formState.isSubmitting;
  const isLoadingSenha = isPendingSenha || formSenha.formState.isSubmitting;

  return (
    <div className={cn("space-y-8")}>
      {/* Seção de Dados Pessoais */}
      <div className={cn("p-6 bg-white rounded-lg border")}>
        <h3 className={cn("text-lg font-semibold text-teal-900")}>Dados Pessoais</h3>
        <p className={cn("text-sm text-slate-500 mt-1")}>Visualize e atualize suas informações.</p>
        <Separator className={cn("my-4")} />

        <form onSubmit={formPerfil.handleSubmit(onSubmitPerfil)} className={cn("flex flex-col gap-5 max-w-lg")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" disabled={isLoadingPerfil} {...formPerfil.register("full_name")} />
            {formPerfil.formState.errors.full_name && (
              <p className={cn("text-sm text-destructive")}>{formPerfil.formState.errors.full_name.message}</p>
            )}
          </div>

          <div className={cn("flex flex-col gap-2")}>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={initialData.email || ""} readOnly disabled />
            <p className={cn("text-xs text-slate-400")}>O e-mail não pode ser alterado.</p>
          </div>

          {statusPerfil && statusPerfil.formId === "perfil" && (
            <div className={cn("p-3 rounded-md text-center", statusPerfil.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800")}>
              <p className={cn("text-sm font-medium")}>{statusPerfil.message}</p>
            </div>
          )}

          <div className={cn("pt-2 flex justify-end")}>
            <Button type="submit" disabled={isLoadingPerfil} className={cn("bg-teal-600 hover:bg-teal-700")}>
              {isLoadingPerfil ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>

      {/* Seção de Alterar Senha */}
      <div className={cn("p-6 bg-white rounded-lg border")}>
        <h3 className={cn("text-lg font-semibold text-teal-900")}>Alterar Senha</h3>
        <p className={cn("text-sm text-slate-500 mt-1")}>Para sua segurança, escolha uma senha forte.</p>
        <Separator className={cn("my-4")} />

        <form onSubmit={formSenha.handleSubmit(onSubmitSenha)} className={cn("flex flex-col gap-5 max-w-lg")}>
          <div className={cn("flex flex-col gap-2")}>
            <Label htmlFor="new_password">Nova Senha</Label>
            <Input
              id="new_password"
              type="password"
              disabled={isLoadingSenha}
              {...formSenha.register("new_password")}
            />
            {formSenha.formState.errors.new_password && (
              <p className={cn("text-sm text-destructive")}>{formSenha.formState.errors.new_password.message}</p>
            )}
          </div>

          <div className={cn("flex flex-col gap-2")}>
            <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
            <Input
              id="confirm_password"
              type="password"
              disabled={isLoadingSenha}
              {...formSenha.register("confirm_password")}
            />
            {formSenha.formState.errors.confirm_password && (
              <p className={cn("text-sm text-destructive")}>{formSenha.formState.errors.confirm_password.message}</p>
            )}
          </div>

          {statusSenha && statusSenha.formId === "senha" && (
            <div className={cn("p-3 rounded-md text-center", statusSenha.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800")}>
              <p className={cn("text-sm font-medium")}>{statusSenha.message}</p>
            </div>
          )}

          <div className={cn("pt-2 flex justify-end")}>
            <Button type="submit" disabled={isLoadingSenha} className={cn("bg-amber-600 hover:bg-amber-700")}>
              {isLoadingSenha ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}