import { randomUUID } from "node:crypto"
import { renderToBuffer } from "@react-pdf/renderer"
import { createClient } from "@/lib/supabase/server"
import { calcularProgressoCurso } from "@/utils/calcularProgressoCurso"
import { formatDateLong } from "@/utils/formatDate"
import { slugify } from "@/utils/slugify"
import { CertificadoDocument } from "./CertificadoDocument"

type Props = { params: Promise<{ courseId: string }> }

export async function GET(_request: Request, { params }: Props) {
  const { courseId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Não autenticado.", { status: 401 })
  }

  const { data: curso } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single()

  if (!curso) {
    return new Response("Curso não encontrado.", { status: 404 })
  }

  const { total, percentual } = await calcularProgressoCurso(courseId, user.id)

  if (total === 0 || percentual < 100) {
    return new Response("Curso ainda não foi concluído.", { status: 403 })
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("is_published", true)

  const lessonIds = (lessons ?? []).map((l: { id: string }) => l.id)

  const { data: ultimoProgresso } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single()

  const buffer = await renderToBuffer(
    CertificadoDocument({
      data: {
        studentName: profile?.full_name ?? "Aluno NEXORA",
        courseName: curso.title,
        completedAt: formatDateLong(
          ultimoProgresso?.completed_at ?? new Date().toISOString(),
        ),
        verificationCode: randomUUID(),
      },
    }),
  )

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${slugify(curso.title)}.pdf"`,
    },
  })
}
