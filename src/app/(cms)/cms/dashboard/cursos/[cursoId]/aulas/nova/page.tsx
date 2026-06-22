import type { Metadata } from "next"
import { NovaAulaView } from "./_features/NovaAula/view"

export const metadata: Metadata = {
  title: "Nova Aula | CMS — NEXORA",
}

type Props = { params: Promise<{ cursoId: string }> }

export default async function NovaAulaPage({ params }: Props) {
  const { cursoId } = await params
  return <NovaAulaView cursoId={cursoId} />
}
