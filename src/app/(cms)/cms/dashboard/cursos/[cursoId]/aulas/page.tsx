import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lesson } from "@/lib/supabase/types";
import { AulasListView } from "./_features/AulasList/view";

type PageProps = {
  params: Promise<{ cursoId: string }>;
};

export const metadata: Metadata = {
  title: "Aulas — NEXORA CMS",
};

export default async function AulasPage({ params }: PageProps) {
  const { cursoId } = await params;
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("lessons")
    .select("*")
    .eq("course_id", cursoId)
    .order("position", { ascending: true });

  const aulas: Lesson[] = data ?? [];

  return <AulasListView aulas={aulas} cursoId={cursoId} />;
}
