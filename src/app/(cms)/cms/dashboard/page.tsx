import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createAdminClient } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";
import { DashboardView } from "./_features/dashboard/view";

async function DashboardData() {
  const adminClient = createAdminClient();

  const [
    { count: totalEventos },
    { count: eventosPublicados },
    { count: totalAdmins },
  ] = await Promise.all([
    adminClient.from("events").select("*", { count: "exact", head: true }),
    adminClient
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <DashboardView
      totalEventos={totalEventos ?? 0}
      eventosPublicados={eventosPublicados ?? 0}
      totalAdmins={totalAdmins ?? 0}
    />
  );
}

function DashboardLoading() {
  return (
    <section
      className={cn("space-y-6")}
      aria-label="Carregando dashboard"
      aria-busy="true"
    >
      <div className={cn("space-y-2")}>
        <Skeleton className={cn("h-8 w-40")} />
        <Skeleton className={cn("h-4 w-full max-w-md")} />
      </div>
      <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3")}>
        <Skeleton className={cn("h-32")} />
        <Skeleton className={cn("h-32")} />
        <Skeleton className={cn("h-32")} />
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardData />
    </Suspense>
  );
}
