import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import type { AdminProfile, AdminRole } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { PerfilView } from "./_features/Perfil";
import type { PerfilInitialData } from "./_features/Perfil/model";

export const metadata: Metadata = {
  title: "Meu perfil — NEXORA CMS",
};

const COOLDOWN_MS = 2 * 60 * 60 * 1000;

type AuthMetadata = Record<string, unknown>;

function getNextChangeAt(metadata: AuthMetadata, key: string) {
  const value = metadata[key];

  if (typeof value !== "string") {
    return null;
  }

  const nextChangeAt = new Date(value).getTime() + COOLDOWN_MS;

  if (Number.isNaN(nextChangeAt) || nextChangeAt <= Date.now()) {
    return null;
  }

  return new Date(nextChangeAt).toISOString();
}

function PerfilLoading() {
  return (
    <section
      className={cn(["space-y-6"])}
      aria-label="Carregando perfil"
      aria-busy="true"
    >
      <div className={cn(["space-y-2"])}>
        <Skeleton className={cn(["h-8 w-48"])} />
        <Skeleton className={cn(["h-4 w-full max-w-lg"])} />
      </div>
      <div className={cn(["grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]"])}>
        <div className={cn(["space-y-6"])}>
          <Skeleton className={cn(["h-64"])} />
          <Skeleton className={cn(["h-56"])} />
          <Skeleton className={cn(["h-72"])} />
        </div>
        <div className={cn(["space-y-6"])}>
          <Skeleton className={cn(["h-80"])} />
          <Skeleton className={cn(["h-48"])} />
        </div>
      </div>
    </section>
  );
}

async function PerfilData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/cms/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single<AdminProfile>();

  const metadata = (user.user_metadata ?? {}) as AuthMetadata;
  const initialData: PerfilInitialData = {
    userId: user.id,
    email: user.email ?? "",
    fullName:
      profile?.full_name ??
      (typeof metadata.full_name === "string"
        ? metadata.full_name
        : "Administrador"),
    role: (profile?.role ?? "admin") as AdminRole,
    avatarUrl:
      profile?.avatar_url ??
      (typeof metadata.avatar_url === "string" ? metadata.avatar_url : null),
    nextProfileChangeAt: getNextChangeAt(
      metadata,
      "cms_profile_last_changed_at",
    ),
    nextAvatarChangeAt: getNextChangeAt(metadata, "cms_avatar_last_changed_at"),
    theme: "system",
    fontSize: "md",
  };

  return <PerfilView initialData={initialData} />;
}

export default function PerfilPage() {
  return (
    <Suspense fallback={<PerfilLoading />}>
      <PerfilData />
    </Suspense>
  );
}
