"use client";

import { Camera, KeyRound, UserCircle } from "lucide-react";
import { AccessibilityCard } from "@/components/shared/AccessibilityCard";
import { AvatarDropzone } from "@/components/shared/AvatarDropzone";
import { PasswordStrengthMeter } from "@/components/shared/PasswordStrengthMeter";
import { ProfileActionStatus } from "@/components/shared/ProfileActionStatus";
import { ProfileIdentitySummary } from "@/components/shared/ProfileIdentitySummary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <p className=" text-sm text-muted-foreground">
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
              <CardDescription>
                Visualize e atualize suas informações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={formPerfil.handleSubmit(onSubmitPerfil)}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="full_name">Nome completo</Label>
                  <Input
                    id="full_name"
                    disabled={isLoadingPerfil}
                    {...formPerfil.register("full_name")}
                  />
                  {formPerfil.formState.errors.full_name && (
                    <p className="text-sm text-destructive">
                      {formPerfil.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={initialData.email || ""}
                    readOnly
                    disabled
                    className="bg-slate-50"
                  />
                  <p className="text-xs text-slate-400">
                    O e-mail não pode ser alterado.
                  </p>
                </div>

                <ProfileActionStatus status={statusPerfil} />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoadingPerfil}
                    className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
                  >
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
              <CardDescription>
                Para sua segurança, escolha uma senha forte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={formSenha.handleSubmit(onSubmitSenha)}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="new_password">Nova Senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    disabled={isLoadingSenha}
                    {...formSenha.register("new_password")}
                  />
                  {formSenha.formState.errors.new_password && (
                    <p className="text-sm text-destructive">
                      {formSenha.formState.errors.new_password.message}
                    </p>
                  )}
                  <PasswordStrengthMeter passwordStrength={passwordStrength} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    disabled={isLoadingSenha}
                    {...formSenha.register("confirm_password")}
                  />
                  {formSenha.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive">
                      {formSenha.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <ProfileActionStatus status={statusSenha} />

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoadingSenha}
                    className="bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold w-full sm:w-auto"
                  >
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

                <ProfileIdentitySummary
                  fullName={initialData.full_name}
                  email={initialData.email}
                />

                <ProfileActionStatus status={statusAvatar} />

                <Button
                  type="submit"
                  disabled={isPendingAvatar}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
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
