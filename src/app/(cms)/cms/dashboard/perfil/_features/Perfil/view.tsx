"use client";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  KeyRound,
  ShieldAlert,
  Trash2,
  UserCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PerfilInitialData } from "./model";
import { usePerfilViewModel } from "./viewModel";

const OTP_SLOTS = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

type Props = {
  initialData: PerfilInitialData;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function CooldownHint({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <p
      className={cn(["flex items-center gap-1 text-xs text-muted-foreground"])}
    >
      <Clock className={cn(["size-3"])} />
      Próxima alteração liberada após {new Date(value).toLocaleString("pt-BR")}.
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
    avatarPreview,
    handleAvatarPreview,
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
  } = usePerfilViewModel({ initialData });
  const initials = getInitials(initialData.fullName) || "NX";
  const avatarUrl = avatarPreview ?? initialData.avatarUrl;

  return (
    <div className={cn(["min-w-0 space-y-6 overflow-hidden"])}>
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
                Alterações de nome têm intervalo mínimo de 2 horas para evitar
                inconsistências.
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
                    <CooldownHint value={initialData.nextProfileChangeAt} />
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

                {statusPerfil?.formId === "perfil" && (
                  <Alert
                    variant={statusPerfil.success ? "default" : "destructive"}
                  >
                    <AlertDescription>{statusPerfil.message}</AlertDescription>
                  </Alert>
                )}

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

          <Card id="preferencias" className={cn(["overflow-hidden"])}>
            <CardHeader>
              <CardTitle>Acessibilidade visual</CardTitle>
              <CardDescription>
                Preferências rápidas persistidas localmente para tema e tamanho
                geral da fonte.
              </CardDescription>
            </CardHeader>
            <CardContent className={cn(["grid gap-6"])}>
              <div className={cn(["space-y-3"])}>
                <Label>Tema</Label>
                <div className={cn(["grid gap-2 sm:grid-cols-3"])}>
                  {[
                    { value: "system", label: "Sistema" },
                    { value: "light", label: "Claro" },
                    { value: "dark", label: "Escuro" },
                  ].map((item) => (
                    <Button
                      key={item.value}
                      type="button"
                      variant={theme === item.value ? "default" : "outline"}
                      onClick={() => setTheme(item.value as typeof theme)}
                      className={cn(["justify-start"])}
                    >
                      {theme === item.value && (
                        <CheckCircle2 className={cn(["size-4"])} />
                      )}
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className={cn(["space-y-3"])}>
                <Label>Tamanho da fonte</Label>
                <div
                  className={cn(["grid gap-2 sm:grid-cols-2 lg:grid-cols-4"])}
                >
                  {fontOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        fontSize === option.value ? "default" : "outline"
                      }
                      onClick={() => setFontSize(option.value)}
                      className={cn(["h-auto flex-col items-start gap-1 py-3"])}
                    >
                      <span>{option.label}</span>
                      <span className={cn(["text-xs opacity-75"])}>
                        {option.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(["overflow-hidden"])}>
            <CardHeader>
              <CardTitle className={cn(["flex items-center gap-2"])}>
                <KeyRound className={cn(["size-5 text-primary"])} />
                Segurança
              </CardTitle>
              <CardDescription>
                Validação de senha preparada. O envio real fica bloqueado até o
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
                    <Input
                      id="new_password"
                      type="password"
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
                    <Input
                      id="confirm_password"
                      type="password"
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

                <div className={cn(["min-w-0 space-y-2"])}>
                  <div
                    className={cn(["flex items-center justify-between gap-3"])}
                  >
                    <Label>Força da senha</Label>
                    <span className={cn(["text-xs text-muted-foreground"])}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength.score}
                    indicatorClassName={passwordStrength.className}
                  />
                </div>

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

                {statusSenha?.formId === "senha" && (
                  <Alert
                    variant={statusSenha.success ? "default" : "destructive"}
                  >
                    <AlertDescription>{statusSenha.message}</AlertDescription>
                  </Alert>
                )}

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
                A nova imagem substitui automaticamente a anterior no Storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={avatarFormAction} className={cn(["space-y-5"])}>
                <div
                  className={cn([
                    "flex flex-col items-center gap-3 text-center",
                  ])}
                >
                  <Avatar
                    size="lg"
                    className={cn([
                      "size-28 border-4 border-background shadow-md ring-1 ring-border",
                    ])}
                  >
                    {avatarUrl && (
                      <AvatarImage src={avatarUrl} alt={initialData.fullName} />
                    )}
                    <AvatarFallback
                      className={cn([
                        "bg-primary text-2xl font-bold text-primary-foreground",
                      ])}
                    >
                      {initials}
                    </AvatarFallback>
                    <AvatarBadge className={cn(["size-7 bg-primary"])}>
                      <Camera className={cn(["size-3.5"])} aria-hidden="true" />
                    </AvatarBadge>
                  </Avatar>
                  <div className={cn(["space-y-1"])}>
                    <p className={cn(["text-sm font-medium"])}>
                      {initialData.fullName}
                    </p>
                    <p className={cn(["text-xs text-muted-foreground"])}>
                      {initialData.email}
                    </p>
                  </div>
                </div>

                <div className={cn(["min-w-0 space-y-2"])}>
                  <Label htmlFor="avatar_file">Nova foto</Label>
                  <Input
                    id="avatar_file"
                    name="avatar_file"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={isPendingAvatar}
                    onChange={handleAvatarPreview}
                  />
                  <p className={cn(["text-xs text-muted-foreground"])}>
                    PNG, JPG ou WebP até 5MB.
                  </p>
                  <CooldownHint value={initialData.nextAvatarChangeAt} />
                </div>

                {statusAvatar?.formId === "avatar" && (
                  <Alert
                    variant={statusAvatar.success ? "default" : "destructive"}
                  >
                    <AlertDescription>{statusAvatar.message}</AlertDescription>
                  </Alert>
                )}

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

          <Card className={cn(["border-destructive/30"])}>
            <CardHeader>
              <CardTitle
                className={cn(["flex items-center gap-2 text-destructive"])}
              >
                <ShieldAlert className={cn(["size-5"])} />
                Zona de perigo
              </CardTitle>
              <CardDescription>
                Exclusão definitiva exige modal de confirmação e operação admin
                segura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      className={cn(["w-full"])}
                    />
                  }
                >
                  <Trash2 className={cn(["size-4"])} />
                  Excluir conta
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Exclusão não pode ser desfeita</DialogTitle>
                    <DialogDescription>
                      Para cumprir a regra da issue #70, este modal antecipa o
                      aviso obrigatório. A ação real será conectada na próxima
                      etapa com validação de senha e operação admin.
                    </DialogDescription>
                  </DialogHeader>
                  <Alert variant="destructive">
                    <AlertDescription>
                      Nenhuma conta será excluída nesta entrega incremental.
                    </AlertDescription>
                  </Alert>
                  <DialogFooter>
                    <Button type="button" variant="outline" disabled>
                      Aguardando fluxo seguro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
