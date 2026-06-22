import type { Metadata } from "next"
import { createAdminClient } from "@/lib/supabase/admin"
import { cn } from "@/lib/utils"
import type { Curso } from "@/lib/supabase/types"
import { CursosCMSView } from "./_features/CursosCMS/view"

export const metadata: Metadata = {
  title: "Gestão de Cursos | CMS — NEXORA",
  description: "Gerencie os cursos da plataforma educacional.",
}

export default async function CursosAdminPage() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className={cn("p-6")}>
        <p className={cn("text-sm text-destructive")}>
          Erro ao carregar cursos: {error.message}
        </p>
      </div>
    )
  }

  return <CursosCMSView initialCursos={(data ?? []) as Curso[]} />
}
