import Image from "next/image"
import Link from "next/link"
import { Award, Camera, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type Curso = {
  id: string
  title: string
  thumbnail_url: string | null
  total_lessons: number
}

export type EnrollmentComCurso = {
  id: string
  course_id: string
  completed_lessons: number
  last_lesson_id: string | null
  courses: Curso
}

type CursoCardProps = {
  enrollment: EnrollmentComCurso
}

export function CursoCard({ enrollment }: CursoCardProps) {
  const { courses, completed_lessons, last_lesson_id } = enrollment
  const total = courses.total_lessons
  const completed = completed_lessons
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const isComplete = percent >= 100

  const continueHref = last_lesson_id
    ? `/cursos/${courses.id}/aulas/${last_lesson_id}`
    : `/cursos/${courses.id}`

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border border-slate-200",
        "hover:shadow-md hover:-translate-y-1 transition-all duration-300",
      )}
    >
      {courses.thumbnail_url ? (
        <Image
          src={courses.thumbnail_url}
          alt={courses.title}
          width={400}
          height={220}
          className={cn("w-full h-44 object-cover")}
        />
      ) : (
        <div
          className={cn(
            "w-full h-44 bg-teal-50 flex items-center justify-center",
          )}
          aria-hidden="true"
        >
          <Camera className={cn("size-10 text-teal-200")} />
        </div>
      )}

      <CardHeader>
        <CardTitle className={cn("text-slate-900 text-base leading-snug")}>
          {courses.title}
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("flex-1 flex flex-col gap-2")}>
        <Progress
          value={percent}
          aria-label={`Progresso: ${completed} de ${total} aulas concluídas`}
        />
        <p className={cn("text-xs text-slate-500")}>
          {completed} de {total} aula{total !== 1 ? "s" : ""}
        </p>
      </CardContent>

      <CardFooter>
        {isComplete ? (
          <Button
            className={cn(
              "w-full bg-amber-500 hover:bg-amber-400 text-teal-900 font-bold border-0",
            )}
            nativeButton={false}
            render={<Link href={`/api/certificados/${courses.id}`} />}
          >
            <Award className={cn("size-4")} aria-hidden="true" />
            Baixar Certificado
          </Button>
        ) : (
          <Button
            className={cn(
              "w-full bg-teal-700 hover:bg-teal-600 text-white border-0",
            )}
            nativeButton={false}
            render={<Link href={continueHref} />}
          >
            <Play className={cn("size-4")} aria-hidden="true" />
            Continuar
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
