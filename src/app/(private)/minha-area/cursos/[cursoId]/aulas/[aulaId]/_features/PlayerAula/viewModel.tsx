"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Lesson } from "@/lib/supabase/types";
import {
  desmarcarConcluida as desmarcarConcluidaAction,
  marcarConcluida as marcarConcluidaAction,
} from "./actions";

export type AulaComProgresso = Lesson & {
  concluida: boolean;
};

export type PlayerAulaViewModel = {
  aulaAtiva: Lesson;
  aulas: AulaComProgresso[];
  isPending: boolean;
  toggleConcluida: () => Promise<void>;
  handleNavegar: (aulaId: string) => void;
};

export function usePlayerAulaViewModel(
  aula: Lesson,
  aulasIniciais: AulaComProgresso[],
): PlayerAulaViewModel {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [aulas, setAulas] = useState(aulasIniciais);

  const toggleConcluida = useCallback(async () => {
    setIsPending(true);

    const aulaAtual = aulas.find((a) => a.id === aula.id);
    const novoEstado = !aulaAtual?.concluida;

    setAulas((prev) =>
      prev.map((a) => (a.id === aula.id ? { ...a, concluida: novoEstado } : a)),
    );

    try {
      if (novoEstado) {
        await marcarConcluidaAction(aula.id, aula.course_id);
      } else {
        await desmarcarConcluidaAction(aula.id, aula.course_id);
      }
      router.refresh();
    } catch {
      setAulas((prev) =>
        prev.map((a) =>
          a.id === aula.id ? { ...a, concluida: !novoEstado } : a,
        ),
      );
    } finally {
      setIsPending(false);
    }
  }, [aula.id, aula.course_id, aulas, router]);

  const handleNavegar = useCallback(
    (aulaId: string) => {
      router.push(`/minha-area/cursos/${aula.course_id}/aulas/${aulaId}`);
    },
    [aula.course_id, router],
  );

  return {
    aulaAtiva: aula,
    aulas,
    isPending,
    toggleConcluida,
    handleNavegar,
  };
}
