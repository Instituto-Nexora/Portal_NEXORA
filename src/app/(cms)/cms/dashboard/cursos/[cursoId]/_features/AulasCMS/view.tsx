"use client"

import Link from "next/link"
import { ArrowLeft, Pencil, Plus, Search, Trash2, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Curso } from "@/lib/supabase/types"
import type { Aula } from "./model"
import { useAulasCMSViewModel } from "./viewModel"

type Props = {
  curso: Curso
  initialAulas: Aula[]
}

function formatarDuracao(segundos: number | null): string {
  if (!segundos) return "—"
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = segundos % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function AulasCMSView({ curso, initialAulas }: Props) {
  const {
    aulasFiltradas,
    searchTerm,
    setSearchTerm,
    aulaParaDeletar,
    setAulaParaDeletar,
    isPending,
    handleConfirmarDeletar,
    handleTogglePublicacao,
  } = useAulasCMSViewModel(curso.id, initialAulas)

  return (
    <div className={cn("p-6 max-w-7xl mx-auto space-y-6")}>
      <div className={cn("flex items-center justify-between gap-4")}>
        <div className={cn("flex items-center gap-3")}>
          <Link href="/cms/dashboard/cursos">
            <Button variant="ghost" size="sm" aria-label="Voltar para lista de cursos">
              <ArrowLeft className={cn("w-4 h-4")} aria-hidden="true" />
            </Button>
          </Link>
          <div>
            <h1 className={cn("text-2xl font-bold text-foreground truncate max-w-md")}>
              {curso.title}
            </h1>
            <p className={cn("text-sm text-muted-foreground")}>
              Aulas do curso — {initialAulas.length} aula{initialAulas.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className={cn("flex items-center gap-2")}>
          <Link href={`/cms/dashboard/cursos/${curso.id}/editar`}>
            <Button variant="outline" size="sm" className={cn("gap-2")}>
              <Pencil className={cn("w-4 h-4")} aria-hidden="true" />
              Editar Curso
            </Button>
          </Link>
          <Link href={`/cms/dashboard/cursos/${curso.id}/aulas/nova`}>
            <Button className={cn("gap-2")}>
              <Plus className={cn("w-4 h-4")} aria-hidden="true" />
              Nova Aula
            </Button>
          </Link>
        </div>
      </div>

      {/* Busca */}
      <div className={cn("bg-card p-4 rounded-xl border shadow-sm")}>
        <div className={cn("relative max-w-sm")}>
          <Search
            className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none")}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Buscar aula por título..."
            className={cn("pl-9")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar aula por título"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className={cn("bg-card rounded-xl border shadow-sm overflow-hidden")}>
        {aulasFiltradas.length === 0 ? (
          <div className={cn("text-center py-20")}>
            <Video className={cn("mx-auto h-10 w-10 text-muted-foreground/30 mb-3")} aria-hidden="true" />
            <p className={cn("text-muted-foreground font-medium")}>
              Nenhuma aula encontrada.
            </p>
            <p className={cn("text-xs text-muted-foreground/60 mt-1")}>
              {searchTerm ? "Tente ajustar a busca." : "Crie a primeira aula com o botão acima."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn("w-12")}>#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("text-right")}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulasFiltradas.map((aula) => (
                <TableRow key={aula.id}>
                  <TableCell className={cn("text-muted-foreground text-sm font-mono")}>
                    {aula.position}
                  </TableCell>
                  <TableCell className={cn("font-medium max-w-xs truncate")}>
                    {aula.title}
                  </TableCell>
                  <TableCell className={cn("text-muted-foreground text-sm")}>
                    {formatarDuracao(aula.duration_seconds)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={aula.is_published ? "default" : "secondary"}
                      className={cn(
                        aula.is_published
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                          : "",
                      )}
                    >
                      {aula.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("text-right")}>
                    <div className={cn("flex items-center justify-end gap-2")}>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleTogglePublicacao(aula)}
                        aria-label={aula.is_published ? `Despublicar aula ${aula.title}` : `Publicar aula ${aula.title}`}
                      >
                        {aula.is_published ? "Despublicar" : "Publicar"}
                      </Button>
                      <Link href={`/cms/dashboard/cursos/${curso.id}/aulas/${aula.id}/editar`}>
                        <Button variant="outline" size="sm" aria-label={`Editar aula ${aula.title}`}>
                          <Pencil className={cn("w-4 h-4")} aria-hidden="true" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setAulaParaDeletar(aula)}
                        aria-label={`Remover aula ${aula.title}`}
                        className={cn("text-destructive hover:text-destructive hover:bg-destructive/10")}
                      >
                        <Trash2 className={cn("w-4 h-4")} aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={aulaParaDeletar !== null}
        onOpenChange={(open) => { if (!open) setAulaParaDeletar(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover aula</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a aula{" "}
              <strong>&quot;{aulaParaDeletar?.title}&quot;</strong>? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAulaParaDeletar(null)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmarDeletar}
              disabled={isPending}
            >
              {isPending ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
