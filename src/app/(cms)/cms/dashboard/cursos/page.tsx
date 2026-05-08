import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Curso } from "@/lib/supabase/types";
import { CursosListView } from "./_features/CursosList/view";

export const metadata: Metadata = {
  title: "Cursos — NEXORA CMS",
};

export default async function CursosPage() {
  const adminClient = createAdminClient();

  const { data } = await adminClient
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  const cursos: Curso[] = data ?? [];

  return <CursosListView cursos={cursos} />;
}
