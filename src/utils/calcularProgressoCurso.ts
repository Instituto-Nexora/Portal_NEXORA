import { createClient } from "@/lib/supabase/server"
import type { ProgressResult } from "@/lib/supabase/types"

export async function calcularProgressoCurso(
  courseId: string,
  userId: string,
): Promise<ProgressResult> {
  const supabase = await createClient()

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_published", true)

  const total = lessons?.length ?? 0

  if (total === 0) {
    return { concluidas: 0, total: 0, percentual: 0 }
  }

  const lessonIds = lessons!.map((l: { id: string }) => l.id)

  const { data: completed } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)

  const concluidas = completed?.length ?? 0
  const percentual = Math.round((concluidas / total) * 100)

  return { concluidas, total, percentual }
}
