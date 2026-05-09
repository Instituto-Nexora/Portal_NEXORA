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
import type { Lesson } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

type Props = {
  aulas: Lesson[];
  cursoId: string;
};

export function AulasListView({ aulas, cursoId }: Props) {
  return (
    <div className={cn("space-y-6")}>
      <div className={cn("flex items-center justify-between")}>
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight")}>Aulas</h1>
          <p className={cn("text-sm text-muted-foreground mt-1")}>
            {aulas.length} aula{aulas.length !== 1 ? "s" : ""} encontrada
            {aulas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href={`/cms/dashboard/cursos/${cursoId}/aulas/nova`} />}
        >
          <PlusIcon />
          Nova aula
        </Button>
      </div>

      <Separator />

      {aulas.length === 0 ? (
        <div className={cn("rounded-lg border border-dashed p-16 text-center")}>
          <p className={cn("text-sm font-medium text-muted-foreground")}>
            Nenhuma aula encontrada.
          </p>
          <p className={cn("text-xs text-muted-foreground mt-1")}>
            <Link
              href={`/cms/dashboard/cursos/${cursoId}/aulas/nova`}
              className={cn("underline underline-offset-2")}
            >
              crie uma nova aula
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className={cn("rounded-lg border overflow-hidden")}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn("w-12")}>#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("hidden md:table-cell")}>
                  Vídeo
                </TableHead>
                <TableHead className={cn("hidden md:table-cell")}>
                  Criado em
                </TableHead>
                <TableHead className={cn("w-16")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {aulas.map((aula) => (
                <TableRow key={aula.id}>
                  <TableCell className={cn("text-xs text-muted-foreground")}>
                    {aula.position}
                  </TableCell>
                  <TableCell>
                    <div className={cn("font-medium")}>{aula.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={aula.is_published ? "default" : "outline"}>
                      {aula.is_published ? "Publicada" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "hidden md:table-cell text-muted-foreground text-xs",
                    )}
                  >
                    {aula.video_url ? "Sim" : "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "hidden md:table-cell text-muted-foreground text-xs",
                    )}
                  >
                    {formatDate(aula.created_at)}
                  </TableCell>
                  <TableCell className={cn("text-right")}>
                    <Tooltip>
                      <TooltipTrigger
                        render={<span className={cn("inline-block")} />}
                      >
                        <Link
                          href={`/cms/dashboard/cursos/${cursoId}/aulas/${aula.id}`}
                          className={cn(
                            "text-xs font-medium text-primary hover:underline underline-offset-2",
                          )}
                        >
                          Editar
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Editar "{aula.title}"</TooltipContent>
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
