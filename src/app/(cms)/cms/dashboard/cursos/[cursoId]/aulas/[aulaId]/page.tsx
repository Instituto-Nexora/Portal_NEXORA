import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditarAulaView } from "./_features/EditarAula/view";

type PageProps = {
  params: Promise<{ cursoId: string; aulaId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { aulaId } = await params;
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("lessons")
    .select("title")
    .eq("id", aulaId)
    .single();

  return {
    title: data
      ? `Editar: ${data.title} — NEXORA CMS`
      : "Editar Aula — NEXORA CMS",
  };
}

export default async function EditarAulaPage({ params }: PageProps) {
  const { aulaId } = await params;
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("lessons")
    .select("*")
    .eq("id", aulaId)
    .single();

  if (!data) {
    notFound();
  }

  return <EditarAulaView aula={data} />;
}
