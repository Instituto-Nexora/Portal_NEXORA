import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdminClient } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";
import { AlunosListView } from "./_features/AlunosList/view";

export const metadata: Metadata = {
  title: "Alunos — NEXORA-TI CMS",
};

async function AlunosData() {
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("student_profiles")
    .select("id, full_name, email, avatar_url, created_at")
    .order("created_at", { ascending: false });

  return <AlunosListView alunos={data ?? []} />;
}

function AlunosLoading() {
  return (
    <section
      className={cn("space-y-6")}
      aria-label="Carregando alunos"
      aria-busy="true"
    >
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className={cn("space-y-2")}>
          <Skeleton className={cn("h-7 w-48")} />
          <Skeleton className={cn("h-4 w-72 max-w-full")} />
        </div>
      </div>
      <div className={cn("grid gap-3 sm:hidden")}>
        <Skeleton className={cn("h-24")} />
        <Skeleton className={cn("h-24")} />
        <Skeleton className={cn("h-24")} />
      </div>
      <div className={cn("hidden space-y-2 rounded-lg border p-4 sm:block")}>
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
        <Skeleton className={cn("h-8 w-full")} />
      </div>
    </section>
  );
}

export default function AlunosPage() {
  return (
    <Suspense fallback={<AlunosLoading />}>
      <AlunosData />
    </Suspense>
  );
}
