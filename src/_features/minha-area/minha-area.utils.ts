import type { CursoComProgresso } from "./types/minha-area.types";

function calcularProgresso(
  aulasConcluidas: number,
  totalAulas: number,
): number {
  return totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;
}

function ordenarPorProgresso(
  cursos: CursoComProgresso[],
  ordem: "asc" | "desc" = "desc",
): CursoComProgresso[] {
  return [...cursos].sort((a, b) =>
    ordem === "desc"
      ? b.progressPercent - a.progressPercent
      : a.progressPercent - b.progressPercent,
  );
}

export { calcularProgresso, ordenarPorProgresso };
