import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event } from "@/lib/supabase/types";
import { EventosListView } from "./_features/EventosList/view";

export const metadata: Metadata = {
  title: "Eventos — NEXORA CMS",
};

type PageProps = {
  searchParams: Promise<{ status?: string; type?: string }>;
};

export default async function EventosPage({ searchParams }: PageProps) {
  const { status, type } = await searchParams;

  const adminClient = createAdminClient();

  let query = adminClient
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data } = await query;

  const eventos: Event[] = data ?? [];

  return (
    <EventosListView
      eventos={eventos}
      statusFilter={status ?? ""}
      typeFilter={type ?? ""}
    />
  );
}
