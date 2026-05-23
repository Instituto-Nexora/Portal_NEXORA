import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/supabase/types";
import PlayerAulaView from "./_features/PlayerAula/view";
import type { AulaComProgresso } from "./_features/PlayerAula/viewModel";

type PageProps = {
  params: Promise<{ cursoId: string; aulaId: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { aulaId } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", aulaId)
    .eq("is_published", true)
    .single();

  return {
    title: data ? `${data.title} — NEXORA` : "Aula — NEXORA",
  };
}

export default async function PlayerAulaPage({ params }: PageProps) {
  const { cursoId, aulaId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", cursoId)
    .maybeSingle();

  if (enrollError) {
    throw enrollError;
  }

  if (!enrollment) {
    redirect("/vendas");
  }

  const { data: aula, error: aulaError } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", aulaId)
    .eq("course_id", cursoId)
    .eq("is_published", true)
    .single();

  if (aulaError) {
    throw aulaError;
  }

  if (!aula) {
    notFound();
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", cursoId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (lessonsError) {
    throw lessonsError;
  }

  const { data: progress, error: progressError } =
    (lessons ?? []).length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, completed_at")
          .eq("user_id", user.id)
          .in(
            "lesson_id",
            (lessons ?? []).map((l) => l.id),
          )
      : { data: [], error: null };

  if (progressError) {
    throw progressError;
  }

  const progressMap = new Map(
    progress?.map((p) => [p.lesson_id, p.completed_at !== null]) ?? [],
  );

  const aulas: AulaComProgresso[] = (lessons ?? []).map((lesson) => ({
    ...(lesson as Lesson),
    concluida: progressMap.get(lesson.id) ?? false,
  }));

  return (
    <PlayerAulaView aula={aula as Lesson} aulas={aulas} cursoId={cursoId} />
  );
}
