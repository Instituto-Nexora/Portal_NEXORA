import type { Metadata } from "next";
import { NovaAulaView } from "./_features/NovaAula/view";

type PageProps = {
  params: Promise<{ cursoId: string }>;
};

export const metadata: Metadata = {
  title: "Nova Aula — NEXORA CMS",
};

export default async function NovaAulaPage({ params }: PageProps) {
  const { cursoId } = await params;

  return <NovaAulaView cursoId={cursoId} />;
}
