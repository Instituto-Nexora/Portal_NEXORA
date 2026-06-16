import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdminClient } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";
import { RelatoriosView } from "./_features/Relatorios/view";

export const metadata: Metadata = {
  title: "Relatórios — NEXORA CMS",
};

async function RelatoriosData() {
  const adminClient = createAdminClient();

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    { count: totalAcessos },
    { count: acessosHoje },
    { count: acessosSemana },
    { data: topRecursos, error: topRecursosError },
    { data: logsAtivos },
    { data: eventos },
    { count: totalMatriculas },
  ] = await Promise.all([
    adminClient
      .from("access_logs")
      .select("*", { count: "exact", head: true }),
    adminClient
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString()),
    adminClient
      .from("access_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    adminClient.rpc("get_top_resources", { limit_n: 10 }),
    adminClient
      .from("access_logs")
      .select("student_id")
      .gte("created_at", monthAgo.toISOString())
      .not("student_id", "is", null),
    adminClient.from("events").select("status"),
    adminClient
      .from("enrollments")
      .select("*", { count: "exact", head: true }),
  ]);

  if (topRecursosError) {
    console.error("[relatorios] get_top_resources rpc error:", topRecursosError);
  }

  const alunosAtivos = new Set(
    (logsAtivos ?? []).map((l) => l.student_id),
  ).size;

  const eventosPorStatus = (eventos ?? []).reduce<Record<string, number>>(
    (acc, e) => {
      acc[e.status] = (acc[e.status] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <RelatoriosView
      totalAcessos={totalAcessos ?? 0}
      acessosHoje={acessosHoje ?? 0}
      acessosSemana={acessosSemana ?? 0}
      alunosAtivos={alunosAtivos}
      topRecursos={topRecursos ?? []}
      eventosPorStatus={eventosPorStatus}
      totalMatriculas={totalMatriculas ?? 0}
    />
  );
}

function RelatoriosLoading() {
  return (
    <section
      className={cn("space-y-6")}
      aria-label="Carregando relatórios"
      aria-busy="true"
    >
      <div className={cn("space-y-2")}>
        <Skeleton className={cn("h-7 w-40")} />
        <Skeleton className={cn("h-4 w-72 max-w-full")} />
      </div>
      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4")}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={cn("h-28")} />
        ))}
      </div>
      <div className={cn("grid gap-6 lg:grid-cols-2")}>
        <Skeleton className={cn("h-64")} />
        <Skeleton className={cn("h-64")} />
      </div>
    </section>
  );
}

export default function RelatoriosPage() {
  return (
    <Suspense fallback={<RelatoriosLoading />}>
      <RelatoriosData />
    </Suspense>
  );
}
