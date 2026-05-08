import type { Metadata } from "next";
import { NovoCursoView } from "./_features/NovoCurso/view";

export const metadata: Metadata = {
  title: "Novo Curso — NEXORA CMS",
};

export default function NovoCursoPage() {
  return <NovoCursoView />;
}
