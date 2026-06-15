"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { marcarAulaConcluida } from "./actions"

export function usePlayerAulaViewModel(
  cursoId: string,
  aulaId: string,
  userId: string,
  aulasConcluidas: string[],
) {
  const [concluidas, setConcluidas] = useState<Set<string>>(
    new Set(aulasConcluidas),
  )
  const [isPending, startTransition] = useTransition()

  const isConcluida = concluidas.has(aulaId)

  function handleMarcarConcluida() {
    if (isConcluida) return
    startTransition(async () => {
      try {
        await marcarAulaConcluida(cursoId, aulaId, userId)
        setConcluidas((prev) => new Set(prev).add(aulaId))
        toast.success("Aula marcada como concluída!")
      } catch {
        toast.error("Erro ao registrar progresso.")
      }
    })
  }

  return { concluidas, isConcluida, isPending, handleMarcarConcluida }
}
