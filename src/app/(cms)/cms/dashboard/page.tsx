import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardView } from "./_features/dashboard/view";

export default async function DashboardPage() {
  const adminClient = createAdminClient();

  const [{ count: totalEventos }, { count: eventosPublicados }, { count: totalAdmins }] =
    await Promise.all([
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
