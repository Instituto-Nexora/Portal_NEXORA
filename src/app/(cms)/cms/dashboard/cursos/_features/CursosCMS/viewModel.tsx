"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import type { Curso } from "./model"
import { deletarCurso, togglePublicacao } from "./actions"

export function useCursosCMSViewModel(initialCursos: Curso[]) {
  const [cursos, setCursos] = useState<Curso[]>(initialCursos)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"todos" | "publicado" | "rascunho">("todos")
  const [cursoParaDeletar, setCursoParaDeletar] = useState<Curso | null>(null)
  const [isPending, startTransition] = useTransition()

  const cursosFiltrados = cursos.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus =
      filterStatus === "todos" ||
      (filterStatus === "publicado" && c.is_published) ||
      (filterStatus === "rascunho" && !c.is_published)
    return matchSearch && matchStatus
  })

  function handleConfirmarDeletar() {
    if (!cursoParaDeletar) return
    const id = cursoParaDeletar.id
    startTransition(async () => {
      try {
        await deletarCurso(id)
        setCursos((prev) => prev.filter((c) => c.id !== id))
        toast.success("Curso removido com sucesso.")
      } catch {
        toast.error("Erro ao remover curso.")
      } finally {
        setCursoParaDeletar(null)
      }
    })
  }

  function handleTogglePublicacao(curso: Curso) {
    startTransition(async () => {
      try {
        await togglePublicacao(curso.id, curso.is_published)
        setCursos((prev) =>
          prev.map((c) =>
            c.id === curso.id ? { ...c, is_published: !c.is_published } : c,
          ),
        )
        toast.success(
          curso.is_published ? "Curso despublicado." : "Curso publicado.",
        )
      } catch {
        toast.error("Erro ao alterar publicação.")
      }
    })
  }

  return {
    cursosFiltrados,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    cursoParaDeletar,
    setCursoParaDeletar,
    isPending,
    handleConfirmarDeletar,
    handleTogglePublicacao,
  }
}
