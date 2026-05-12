import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PerfilView from "./features/view";

export const metadata: Metadata = {
  title: "Meu Perfil - NEXORA",
};

export default async function PerfilPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/login");

  return (
    // O layout da "minha-area" já provê o padding e o título principal
    <PerfilView initialData={profile} />
  );
}
