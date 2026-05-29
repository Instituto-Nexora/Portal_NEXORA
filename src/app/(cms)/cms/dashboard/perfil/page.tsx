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

const DAILY_CHANGE_LIMIT = 5;
const DAILY_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const PROFILE_HISTORY_METADATA_KEY = "cms_profile_change_history";
const AVATAR_HISTORY_METADATA_KEY = "cms_avatar_change_history";
const PASSWORD_HISTORY_METADATA_KEY = "cms_password_change_history";

type AuthMetadata = Record<string, unknown>;

function getRecentDailyChanges(metadata: AuthMetadata, key: string) {
  const value = metadata[key];
  const now = Date.now();

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => {
    if (typeof entry !== "string") {
      return false;
    }

    const timestamp = new Date(entry).getTime();
    return (
      !Number.isNaN(timestamp) &&
      timestamp <= now &&
      now - timestamp < DAILY_LIMIT_WINDOW_MS
    );
  });
}

function getChangesRemaining(metadata: AuthMetadata, key: string) {
  return Math.max(
    DAILY_CHANGE_LIMIT - getRecentDailyChanges(metadata, key).length,
    0,
  );
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
    profileChangesRemaining: getChangesRemaining(
      metadata,
      PROFILE_HISTORY_METADATA_KEY,
    ),
    avatarChangesRemaining: getChangesRemaining(
      metadata,
      AVATAR_HISTORY_METADATA_KEY,
    ),
    passwordChangesRemaining: getChangesRemaining(
      metadata,
      PASSWORD_HISTORY_METADATA_KEY,
    ),
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
