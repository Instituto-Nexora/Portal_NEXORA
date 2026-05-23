import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MinhaAreaView } from "@/_features/minha-area/minha-area.view";
import type { CursoComProgresso } from "@/_features/minha-area/types/minha-area.types";
import { createClient } from "@/lib/supabase/server";
import type { Curso } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Meus Cursos - NEXORA",
};

export default async function MinhaAreaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: enrollments, error: enrollError } = await supabase
    .from("enrollments")
    .select("id, course_id")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (enrollError) {
    throw enrollError;
  }

  const enrollmentList = enrollments ?? [];

  if (enrollmentList.length === 0) {
    return <MinhaAreaView cursos={[]} />;
  }

  const courseIds = enrollmentList.map((e) => e.course_id);

  const { data: cursosData, error: cursosError } = await supabase
    .from("courses")
    .select("*")
    .in("id", courseIds);

  if (cursosError) {
    throw cursosError;
  }

  const cursosMap = new Map((cursosData ?? []).map((c) => [c.id, c as Curso]));

  const { data: lessonsData, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, course_id")
    .eq("is_published", true)
    .in("course_id", courseIds);

  if (lessonsError) {
    throw lessonsError;
  }

  const lessonsPerCourse = new Map<string, string[]>();
  const allLessonIds: string[] = [];

  for (const lesson of lessonsData ?? []) {
    const list = lessonsPerCourse.get(lesson.course_id);
    if (list) {
      list.push(lesson.id);
    } else {
      lessonsPerCourse.set(lesson.course_id, [lesson.id]);
    }
    allLessonIds.push(lesson.id);
  }

  const { data: progressData, error: progressError } =
    allLessonIds.length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .not("completed_at", "is", null)
          .in("lesson_id", allLessonIds)
      : { data: [], error: null };

  if (progressError) {
    throw progressError;
  }

  const completedSet = new Set(progressData?.map((p) => p.lesson_id) ?? []);

  const cursosComProgresso: CursoComProgresso[] = [];

  for (const enrollment of enrollmentList) {
    const curso = cursosMap.get(enrollment.course_id);
    if (!curso) continue;

    const aulas = lessonsPerCourse.get(enrollment.course_id) ?? [];
    const totalAulas = aulas.length;
    const aulasConcluidas = aulas.filter((id) => completedSet.has(id)).length;
    const progressPercent =
      totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

    cursosComProgresso.push({
      ...curso,
      enrollmentId: enrollment.id,
      progressPercent,
      totalAulas,
      aulasConcluidas,
    });
  }

  return <MinhaAreaView cursos={cursosComProgresso} />;
}
