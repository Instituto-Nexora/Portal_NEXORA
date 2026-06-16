"use client";

import {
  AlertTriangle,
  Camera,
  Clock,
  KeyRound,
  UserCircle,
} from "lucide-react";
import { AccessibilityCard } from "@/components/shared/AccessibilityCard";
import { AvatarDropzone } from "@/components/shared/AvatarDropzone";
import { PasswordStrengthMeter } from "@/components/shared/PasswordStrengthMeter";
import { ProfileActionStatus } from "@/components/shared/ProfileActionStatus";
import { ProfileIdentitySummary } from "@/components/shared/ProfileIdentitySummary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";
import type { PerfilInitialData } from "./model";
import { usePerfilViewModel } from "./viewModel";

const OTP_SLOTS = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

type Props = {
  initialData: PerfilInitialData;
};

function DailyChangeHint({ remaining }: { remaining: number }) {
  return (
    <p
      className={cn(["flex items-center gap-1 text-xs text-muted-foreground"])}
    >
      <Clock className={cn(["size-3"])} />
      Limite diário: até 5 alterações. Restantes no período: {remaining}.
    </p>
  );
}

export function PerfilView({ initialData }: Props) {
  const {
    formPerfil,
    onSubmitPerfil,
    statusPerfil,
    isPendingPerfil,
    statusAvatar,
    avatarFormAction,
    isPendingAvatar,
    formSenha,
    onSubmitSenha,
    statusSenha,
    isPendingSenha,
    passwordStrength,
    theme,
    setTheme,
    fontSize,
    fontOptions,
    setFontSize,
    dailyLimitDialog,
  } = usePerfilViewModel({ initialData });

  const initials = getInitials(initialData.fullName, "NX");

  return (
    <div className={cn(["min-w-0 space-y-6 overflow-hidden"])}>
      <Dialog
        open={dailyLimitDialog.open}
        onOpenChange={dailyLimitDialog.onOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limite diário alcançado</DialogTitle>
            <DialogDescription>{dailyLimitDialog.message}</DialogDescription>
          </DialogHeader>
          {dailyLimitDialog.resetAt && (
            <Alert variant="destructive">
              <AlertTriangle className={cn(["size-4"])} />
              <AlertDescription>
                Nova tentativa disponível a partir de{" "}
                {new Date(dailyLimitDialog.resetAt).toLocaleString("pt-BR")}.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className={cn(["w-full sm:w-auto"])}
                />
              }
            >
              Entendi
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={cn([
          "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        ])}
      >
        <div className={cn(["min-w-0 space-y-1"])}>
          <h1 className={cn(["text-2xl font-bold tracking-tight sm:text-3xl"])}>
            Meu perfil
          </h1>
          <p className={cn(["max-w-2xl text-sm text-muted-foreground"])}>
            Gerencie dados pessoais, foto de perfil, acessibilidade visual e
            segurança da conta do CMS.
          </p>
        </div>
        <div
          className={cn([
            "rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground",
          ])}
        >
          Perfil CMS · {initialData.role}
        </div>
      </div>

      <div
        className={cn([
          "grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]",
        ])}
      >
        <div className={cn(["min-w-0 space-y-6"])}>
          <Card className={cn(["overflow-hidden"])}>
            <CardHeader>
              <CardTitle className={cn(["flex items-center gap-2"])}>
                <UserCircle className={cn(["size-5 text-primary"])} />
                Dados pessoais
              </CardTitle>
              <CardDescription>
                Alterações de nome podem ser feitas até 5 vezes por dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={formPerfil.handleSubmit(onSubmitPerfil)}
                className={cn(["grid gap-5"])}
              >
                <div className={cn(["grid min-w-0 gap-4 lg:grid-cols-2"])}>
                  <div className={cn(["min-w-0 space-y-2"])}>
                    <Label htmlFor="full_name">Nome completo</Label>
                    <Input
                      id="full_name"
                      autoComplete="name"
                      disabled={isPendingPerfil}
                      {...formPerfil.register("full_name")}
                    />
                    {formPerfil.formState.errors.full_name && (
                      <p className={cn(["text-xs text-destructive"])}>
                        {formPerfil.formState.errors.full_name.message}
                      </p>
                    )}
                    <DailyChangeHint
                      remaining={initialData.profileChangesRemaining}
                    />
                  </div>
                  <div className={cn(["min-w-0 space-y-2"])}>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={initialData.email}
                      disabled
                      readOnly
                    />
                    <p className={cn(["text-xs text-muted-foreground"])}>
                      O e-mail é gerenciado pelo Supabase Auth.
                    </p>
                  </div>
                </div>

                <ProfileActionStatus status={statusPerfil} />

                <div className={cn(["flex justify-end"])}>
                  <Button
                    type="submit"
                    disabled={isPendingPerfil}
                    className={cn(["w-full sm:w-auto"])}
                  >
                    {isPendingPerfil ? "Salvando..." : "Salvar dados"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <AccessibilityCard
            variant="cms"
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            fontOptions={fontOptions}
            setFontSize={setFontSize}
          />

          <Card className={cn(["overflow-hidden"])}>
            <CardHeader>
              <CardTitle className={cn(["flex items-center gap-2"])}>
                <KeyRound className={cn(["size-5 text-primary"])} />
                Segurança
              </CardTitle>
              <CardDescription>
                Alterações de senha podem ser feitas até 5 vezes por dia após o
                OTP por e-mail estar conectado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={formSenha.handleSubmit(onSubmitSenha)}
                className={cn(["grid gap-5"])}
              >
                <Alert>
                  <AlertTriangle className={cn(["size-4"])} />
                  <AlertDescription>
                    Próxima etapa: conectar envio/verificação de OTP por e-mail
                    antes de liberar alteração real da senha.
                  </AlertDescription>
                </Alert>
                <div className={cn(["grid min-w-0 gap-4 lg:grid-cols-2"])}>
                  <div className={cn(["min-w-0 space-y-2"])}>
                    <Label htmlFor="new_password">Nova senha</Label>
                    <PasswordInput
                      id="new_password"
                      autoComplete="new-password"
                      disabled={isPendingSenha}
                      {...formSenha.register("new_password")}
                    />
                    {formSenha.formState.errors.new_password && (
                      <p className={cn(["text-xs text-destructive"])}>
                        {formSenha.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>
                  <div className={cn(["min-w-0 space-y-2"])}>
                    <Label htmlFor="confirm_password">Confirmar senha</Label>
                    <PasswordInput
                      id="confirm_password"
                      autoComplete="new-password"
                      disabled={isPendingSenha}
                      {...formSenha.register("confirm_password")}
                    />
                    {formSenha.formState.errors.confirm_password && (
                      <p className={cn(["text-xs text-destructive"])}>
                        {formSenha.formState.errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                </div>

                <DailyChangeHint
                  remaining={initialData.passwordChangesRemaining}
                />

                <PasswordStrengthMeter passwordStrength={passwordStrength} />

                <div className={cn(["min-w-0 space-y-2"])}>
                  <Label>Código OTP</Label>
                  <InputOTP length={6} disabled className={cn(["max-w-full"])}>
                    <InputOTPGroup className={cn(["flex-wrap"])}>
                      {OTP_SLOTS.map((slot, index) => (
                        <InputOTPSlot key={slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <ProfileActionStatus status={statusSenha} />

                <div className={cn(["flex justify-end"])}>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isPendingSenha}
                    className={cn(["w-full sm:w-auto"])}
                  >
                    Validar fluxo de senha
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <aside className={cn(["min-w-0 space-y-6"])}>
          <Card className={cn(["overflow-hidden"])}>
            <CardHeader>
              <CardTitle>Foto de perfil</CardTitle>
              <CardDescription>
                A nova imagem substitui automaticamente a anterior no Storage e
                pode ser atualizada até 5 vezes por dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={avatarFormAction} className={cn(["space-y-5"])}>
                <AvatarDropzone
                  initialUrl={initialData.avatarUrl}
                  fallback={initials}
                  name="avatar_file"
                  disabled={isPendingAvatar}
                />

                <ProfileIdentitySummary
                  fullName={initialData.fullName}
                  email={initialData.email}
                />

                <DailyChangeHint
                  remaining={initialData.avatarChangesRemaining}
                />

                <ProfileActionStatus status={statusAvatar} />

                <Button
                  type="submit"
                  disabled={isPendingAvatar}
                  className={cn(["w-full"])}
                >
                  <Camera className={cn(["size-4"])} />
                  {isPendingAvatar ? "Enviando..." : "Atualizar foto"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
