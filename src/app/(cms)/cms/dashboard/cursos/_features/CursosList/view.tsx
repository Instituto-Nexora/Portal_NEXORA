"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Curso } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

type Props = {
  cursos: Curso[];
};

function formatPrice(cents: number | null): string {
  if (cents === null || cents === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function CursosListView({ cursos }: Props) {
  return (
    <div className={cn("space-y-6")}>
      <div className={cn("flex items-center justify-between")}>
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight")}>Cursos</h1>
          <p className={cn("text-sm text-muted-foreground mt-1")}>
            {cursos.length} curso{cursos.length !== 1 ? "s" : ""} encontrado{cursos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/cms/dashboard/cursos/novo" />}>
          <PlusIcon />
          Criar curso
        </Button>
      </div>

      <Separator />

      {cursos.length === 0 ? (
        <div className={cn("rounded-lg border border-dashed p-16 text-center")}>
          <p className={cn("text-sm font-medium text-muted-foreground")}>Nenhum curso encontrado.</p>
          <p className={cn("text-xs text-muted-foreground mt-1")}>
            <Link href="/cms/dashboard/cursos/novo" className={cn("underline underline-offset-2")}>
              crie um novo curso
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className={cn("rounded-lg border overflow-hidden")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("hidden md:table-cell")}>Preço</TableHead>
                <TableHead className={cn("hidden md:table-cell")}>Criado em</TableHead>
                <TableHead className={cn("w-16")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursos.map((curso) => (
                <TableRow key={curso.id}>
                  <TableCell>
                    <div className={cn("font-medium")}>{curso.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={curso.is_published ? "default" : "outline"}>
                      {curso.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("hidden md:table-cell text-muted-foreground text-xs")}>
                    {formatPrice(curso.price_cents)}
                  </TableCell>
                  <TableCell className={cn("hidden md:table-cell text-muted-foreground text-xs")}>
                    {formatDate(curso.created_at)}
                  </TableCell>
                  <TableCell className={cn("text-right")}>
                    <Tooltip>
                      <TooltipTrigger render={<span className={cn("inline-block")} />}>
                        <Link
                          href={`/cms/dashboard/cursos/${curso.id}`}
                          className={cn(
                            "text-xs font-medium text-primary hover:underline underline-offset-2",
                          )}
                        >
                          Editar
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Editar "{curso.title}"</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
