import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditarCursoView } from "./_features/EditarCurso/view";

type PageProps = {
  params: Promise<{ cursoId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cursoId } = await params;
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("courses")
    .select("title")
    .eq("id", cursoId)
    .single();

  return {
    title: data
      ? `Editar: ${data.title} — NEXORA CMS`
      : "Editar Curso — NEXORA CMS",
  };
}

export default async function EditarCursoPage({ params }: PageProps) {
  const { cursoId } = await params;
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("courses")
    .select("*")
    .eq("id", cursoId)
    .single();

  if (!data) {
    notFound();
  }

  return <EditarCursoView curso={data} />;
}
