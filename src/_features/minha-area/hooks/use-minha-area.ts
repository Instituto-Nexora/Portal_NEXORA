import type {
  CursoComProgresso,
  MinhaAreaViewModel,
} from "../types/minha-area.types";

function useMinhaArea(cursos: CursoComProgresso[]): MinhaAreaViewModel {
  return {
    cursos,
    isEmpty: cursos.length === 0,
  };
}

export { useMinhaArea };
