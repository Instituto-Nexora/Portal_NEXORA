import { createAdminClient } from "@/lib/supabase/admin";
import type { Event } from "@/lib/supabase/types";
import { EventosGravados } from "./_features/eventos/EventosGravados";
import { HeroEventos } from "./_features/eventos/HeroEventos";
import { ProximosEventos } from "./_features/eventos/ProximosEventos";

export default async function EventosPage() {
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const eventos: Event[] = data ?? [];
  const now = new Date();

  const proximos = eventos.filter(
    (e) =>
      e.type === "ao_vivo" &&
      (!e.scheduled_at || new Date(e.scheduled_at) >= now),
  );
  const gravados = eventos.filter(
    (e) =>
      e.type === "gravado" ||
      (e.type === "ao_vivo" &&
        !!e.scheduled_at &&
        new Date(e.scheduled_at) < now),
  );

  return (
    <main>
      <HeroEventos />
      <ProximosEventos eventos={proximos} />
      <EventosGravados eventos={gravados} />
    </main>
  );
}
