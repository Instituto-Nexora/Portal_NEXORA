"use client";

import { useMinhaArea } from "./hooks/use-minha-area";
import type {
  CursoComProgresso,
  MinhaAreaViewModel,
} from "./types/minha-area.types";

function useMinhaAreaViewModel(
  cursos: CursoComProgresso[],
): MinhaAreaViewModel {
  return useMinhaArea(cursos);
}

export type { MinhaAreaViewModel };
export { useMinhaAreaViewModel };
