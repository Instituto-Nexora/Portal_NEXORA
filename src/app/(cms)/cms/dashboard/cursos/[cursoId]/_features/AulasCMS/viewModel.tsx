"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import type { Aula } from "./model"
import { deletarAula, togglePublicacaoAula } from "./actions"

export function useAulasCMSViewModel(cursoId: string, initialAulas: Aula[]) {
  const [aulas, setAulas] = useState<Aula[]>(initialAulas)
  const [searchTerm, setSearchTerm] = useState("")
  const [aulaParaDeletar, setAulaParaDeletar] = useState<Aula | null>(null)
  const [isPending, startTransition] = useTransition()

  const aulasFiltradas = aulas.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleConfirmarDeletar() {
    if (!aulaParaDeletar) return
    const { id } = aulaParaDeletar
    startTransition(async () => {
      try {
        await deletarAula(cursoId, id)
        setAulas((prev) => prev.filter((a) => a.id !== id))
        toast.success("Aula removida com sucesso.")
      } catch {
        toast.error("Erro ao remover aula.")
      } finally {
        setAulaParaDeletar(null)
      }
    })
  }

  function handleTogglePublicacao(aula: Aula) {
    startTransition(async () => {
      try {
        await togglePublicacaoAula(cursoId, aula.id, aula.is_published)
        setAulas((prev) =>
          prev.map((a) =>
            a.id === aula.id ? { ...a, is_published: !a.is_published } : a,
          ),
        )
        toast.success(aula.is_published ? "Aula despublicada." : "Aula publicada.")
      } catch {
        toast.error("Erro ao alterar publicação.")
      }
    })
  }

  return {
    aulasFiltradas,
    searchTerm,
    setSearchTerm,
    aulaParaDeletar,
    setAulaParaDeletar,
    isPending,
    handleConfirmarDeletar,
    handleTogglePublicacao,
  }
}
