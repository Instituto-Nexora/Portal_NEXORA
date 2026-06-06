"use client"

import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Curso } from "./model"
import { useCursosCMSViewModel } from "./viewModel"

type Props = {
  initialCursos: Curso[]
}

function formatarPreco(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function CursosCMSView({ initialCursos }: Props) {
  const {
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
  } = useCursosCMSViewModel(initialCursos)

  return (
    <div className={cn("p-6 max-w-7xl mx-auto space-y-6")}>
      <div className={cn("flex items-center justify-between gap-4")}>
        <div>
          <h1 className={cn("text-3xl font-bold text-foreground")}>
            Gestão de Cursos
          </h1>
          <p className={cn("text-muted-foreground mt-1")}>
            Gerencie os cursos da plataforma educacional.
          </p>
        </div>
        <Link href="/cms/dashboard/cursos/novo">
          <Button className={cn("gap-2")}>
            <Plus className={cn("w-4 h-4")} aria-hidden="true" />
            Novo Curso
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className={cn("flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border shadow-sm")}>
        <div className={cn("relative flex-1")}>
          <Search
            className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none")}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Buscar por título..."
            className={cn("pl-9")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar curso por título"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
        >
          <SelectTrigger className={cn("w-full sm:w-44")} aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="publicado">Publicado</SelectItem>
            <SelectItem value="rascunho">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela */}
      <div className={cn("bg-card rounded-xl border shadow-sm overflow-hidden")}>
        {cursosFiltrados.length === 0 ? (
          <div className={cn("text-center py-20")}>
            <BookOpen className={cn("mx-auto h-10 w-10 text-muted-foreground/30 mb-3")} aria-hidden="true" />
            <p className={cn("text-muted-foreground font-medium")}>
              Nenhum curso encontrado.
            </p>
            <p className={cn("text-xs text-muted-foreground/60 mt-1")}>
              {searchTerm ? "Tente ajustar a busca." : "Crie o primeiro curso com o botão acima."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("text-right")}>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursosFiltrados.map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell className={cn("font-medium max-w-xs truncate")}>
                    {curso.title}
                  </TableCell>
                  <TableCell className={cn("text-muted-foreground")}>
                    {formatarPreco(curso.price_cents)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={curso.is_published ? "default" : "secondary"}
                      className={cn(
                        curso.is_published
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15"
                          : "",
                      )}
                    >
                      {curso.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("text-right")}>
                    <div className={cn("flex items-center justify-end gap-2")}>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleTogglePublicacao(curso)}
                        aria-label={curso.is_published ? `Despublicar curso ${curso.title}` : `Publicar curso ${curso.title}`}
                      >
                        {curso.is_published ? "Despublicar" : "Publicar"}
                      </Button>
                      <Link href={`/cms/dashboard/cursos/${curso.id}/editar`}>
                        <Button variant="outline" size="sm" aria-label={`Editar curso ${curso.title}`}>
                          <Pencil className={cn("w-4 h-4")} aria-hidden="true" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setCursoParaDeletar(curso)}
                        aria-label={`Remover curso ${curso.title}`}
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
        open={cursoParaDeletar !== null}
        onOpenChange={(open) => { if (!open) setCursoParaDeletar(null) }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover curso</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o curso{" "}
              <strong>&quot;{cursoParaDeletar?.title}&quot;</strong>? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCursoParaDeletar(null)}
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
