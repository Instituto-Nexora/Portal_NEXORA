import type { Metadata } from "next"
import { NovoCursoView } from "./_features/NovoCurso/view"

export const metadata: Metadata = {
  title: "Novo Curso | CMS — NEXORA",
  description: "Crie um novo curso na plataforma educacional.",
}

export default function NovoCursoPage() {
  return <NovoCursoView />
}
