"use client";

import { Camera, KeyRound, UserCircle } from "lucide-react";
import { AccessibilityCard } from "@/components/shared/AccessibilityCard";
import { AvatarDropzone } from "@/components/shared/AvatarDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";
import type { PerfilInitialData } from "./model";
import { usePerfilViewModel } from "./viewModel";

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
    passwordStrength,
    statusAvatar,
    avatarFormAction,
    isPendingAvatar,
    theme,
    setTheme,
    fontSize,
    fontOptions,
    setFontSize,
  } = usePerfilViewModel({ initialData });

  const isLoadingPerfil = isPendingPerfil || formPerfil.formState.isSubmitting;
  const isLoadingSenha = isPendingSenha || formSenha.formState.isSubmitting;
  const initials = getInitials(initialData.full_name ?? "", "AL");

  return (
    <div className="min-w-0 space-y-6 overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-teal-900">
            Meu perfil
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Gerencie dados pessoais e a segurança da conta.
          </p>
        </div>
        <div className="rounded-full border bg-teal-50 px-3 py-1 text-xs text-teal-700 font-medium">
          Perfil Aluno
        </div>
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] items-start">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <UserCircle className="h-5 w-5 text-teal-600" />
                Dados pessoais
              </CardTitle>
              <CardDescription>Visualize e atualize suas informações.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formPerfil.handleSubmit(onSubmitPerfil)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="full_name">Nome completo</Label>
                  <Input id="full_name" disabled={isLoadingPerfil} {...formPerfil.register("full_name")} />
                  {formPerfil.formState.errors.full_name && (
                    <p className="text-sm text-destructive">{formPerfil.formState.errors.full_name.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={initialData.email || ""} readOnly disabled className="bg-slate-50" />
                  <p className="text-xs text-slate-400">O e-mail não pode ser alterado.</p>
                </div>

                {statusPerfil?.formId === "perfil" && (
                  <div className={cn("p-3 rounded-md text-center", statusPerfil.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800")}>
                    <p className="text-sm font-medium">{statusPerfil.message}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isLoadingPerfil} className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                    {isLoadingPerfil ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <KeyRound className="h-5 w-5 text-amber-500" />
                Segurança
              </CardTitle>
              <CardDescription>Para sua segurança, escolha uma senha forte.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formSenha.handleSubmit(onSubmitSenha)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new_password">Nova Senha</Label>
                  <Input id="new_password" type="password" disabled={isLoadingSenha} {...formSenha.register("new_password")} />
                  {formSenha.formState.errors.new_password && (
                    <p className="text-sm text-destructive">{formSenha.formState.errors.new_password.message}</p>
                  )}
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Força da senha</span>
                      <span className={cn("font-medium", passwordStrength.textColor)}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength.score}
                      className={cn("h-1.5 bg-slate-100", passwordStrength.barColor && `[&>div]:${passwordStrength.barColor}`)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                  <Input id="confirm_password" type="password" disabled={isLoadingSenha} {...formSenha.register("confirm_password")} />
                  {formSenha.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive">{formSenha.formState.errors.confirm_password.message}</p>
                  )}
                </div>

                {statusSenha?.formId === "senha" && (
                  <div className={cn("p-3 rounded-md text-center", statusSenha.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800")}>
                    <p className="text-sm font-medium">{statusSenha.message}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isLoadingSenha} className="bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold w-full sm:w-auto">
                    {isLoadingSenha ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de perfil</CardTitle>
              <CardDescription>
                A nova imagem substitui automaticamente a anterior no Storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={avatarFormAction} className="space-y-5">
                <AvatarDropzone
                  initialUrl={initialData.avatar_url}
                  fallback={initials}
                  name="avatar_file"
                  disabled={isPendingAvatar}
                  fallbackClassName="bg-teal-600 text-white"
                />

                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium">{initialData.full_name}</p>
                  <p className="text-xs text-muted-foreground">{initialData.email}</p>
                </div>

                {statusAvatar?.formId === "avatar" && (
                  <div className={cn("p-3 rounded-md text-center", statusAvatar.success ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800")}>
                    <p className="text-sm font-medium">{statusAvatar.message}</p>
                  </div>
                )}

                <Button type="submit" disabled={isPendingAvatar} className="w-full bg-teal-600 hover:bg-teal-700">
                  <Camera className="mr-2 h-4 w-4" />
                  {isPendingAvatar ? "Enviando..." : "Atualizar foto"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <AccessibilityCard
            variant="aluno"
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            fontOptions={fontOptions}
            setFontSize={setFontSize}
          />
        </aside>
      </div>
    </div>
  );
}
