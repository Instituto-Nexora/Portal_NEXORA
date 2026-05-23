import type { Curso } from "@/lib/supabase/types";

type CursoComProgresso = Curso & {
  enrollmentId: string;
  progressPercent: number;
  totalAulas: number;
  aulasConcluidas: number;
};

type MinhaAreaViewModel = {
  cursos: CursoComProgresso[];
  isEmpty: boolean;
};

export type { CursoComProgresso, MinhaAreaViewModel };
