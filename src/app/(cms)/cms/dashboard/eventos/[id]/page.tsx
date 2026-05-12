import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditarEventoView } from "./_features/EditarEvento/view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("events")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: data
      ? `Editar: ${data.title} — NEXORA CMS`
      : "Editar Evento — NEXORA CMS",
  };
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params;
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  return <EditarEventoView evento={data} />;
}
