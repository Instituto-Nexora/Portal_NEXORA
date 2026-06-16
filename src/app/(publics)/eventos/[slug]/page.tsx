import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { logAccess } from "@/lib/analytics/logAccess";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { EventoDetalheView } from "./_features/EventoDetalhe/view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Evento não encontrado — NEXORA-TI" };
  }

  return {
    title: `${data.title} — NEXORA-TI`,
    description: data.description,
  };
}

export default async function EventoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await logAccess({
    studentId: user?.id,
    resourceType: "event",
    resourceId: data.id,
    resourceSlug: data.slug,
  });

  const { data: outros } = await adminClient
    .from("events")
    .select("id, slug, title, description, type, scheduled_at, thumbnail_url")
    .eq("status", "published")
    .neq("id", data.id)
    .limit(10);

  const outrosEventos = (outros ?? [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return <EventoDetalheView evento={data} outrosEventos={outrosEventos} />;
}
