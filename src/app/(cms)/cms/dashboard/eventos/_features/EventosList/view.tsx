"use client";

import { PlusIcon, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Event, EventStatus, EventType } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";

type Props = {
  eventos: Event[];
  statusFilter?: string;
  typeFilter?: string;
};

const STATUS_LABEL: Record<EventStatus, string> = {
  draft: "Rascunho",
  published: "Publicado",
  archived: "Arquivado",
};

const STATUS_VARIANT: Record<EventStatus, "default" | "secondary" | "outline"> = {
  draft: "outline",
  published: "default",
  archived: "secondary",
};

const TYPE_LABEL: Record<EventType, string> = {
  ao_vivo: "Ao Vivo",
  gravado: "Gravado",
};

export function EventosListView({ eventos, statusFilter = "", typeFilter = "" }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(statusFilter);
  const [type, setType] = useState(typeFilter);

  function handleFilter() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    router.push(`/cms/dashboard/eventos?${params.toString()}`);
  }

  function handleReset() {
    setStatus("");
    setType("");
    router.push("/cms/dashboard/eventos");
  }

  const hasActiveFilters = !!statusFilter || !!typeFilter;

  return (
    <div className={cn("space-y-6")}>
      <div className={cn("flex items-center justify-between")}>
        <div>
          <h1 className={cn("text-2xl font-bold tracking-tight")}>Eventos</h1>
          <p className={cn("text-sm text-muted-foreground mt-1")}>
            {eventos.length} evento{eventos.length !== 1 ? "s" : ""} encontrado{eventos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button render={<Link href="/cms/dashboard/eventos/novo" />}>
          <PlusIcon />
          Criar evento
        </Button>
      </div>

      <Separator />

      <div className={cn("flex items-end gap-3 flex-wrap")}>
        <SlidersHorizontal className={cn("size-4 text-muted-foreground mb-2")} aria-hidden="true" />

        <div className={cn("space-y-1")}>
          <Label htmlFor="filter-status" className={cn("text-xs text-muted-foreground")}>
            Status
          </Label>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "")}>
            <SelectTrigger id="filter-status" className={cn("w-40")}>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={cn("space-y-1")}>
          <Label htmlFor="filter-type" className={cn("text-xs text-muted-foreground")}>
            Tipo
          </Label>
          <Select value={type} onValueChange={(v) => setType(v ?? "")}>
            <SelectTrigger id="filter-type" className={cn("w-36")}>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="ao_vivo">Ao Vivo</SelectItem>
              <SelectItem value="gravado">Gravado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleFilter} size="sm">
          Filtrar
        </Button>
        {hasActiveFilters && (
          <Button onClick={handleReset} variant="ghost" size="sm">
            Limpar filtros
          </Button>
        )}
      </div>

      {eventos.length === 0 ? (
        <div className={cn("rounded-lg border border-dashed p-16 text-center")}>
          <p className={cn("text-sm font-medium text-muted-foreground")}>Nenhum evento encontrado.</p>
          <p className={cn("text-xs text-muted-foreground mt-1")}>
            {hasActiveFilters ? "Tente remover os filtros ou " : ""}
            <Link href="/cms/dashboard/eventos/novo" className={cn("underline underline-offset-2")}>
              crie um novo evento
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
                <TableHead className={cn("hidden sm:table-cell")}>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("hidden md:table-cell")}>Criado em</TableHead>
                <TableHead className={cn("w-16")} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventos.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell>
                    <div className={cn("font-medium")}>{evento.title}</div>
                    <div className={cn("text-xs text-muted-foreground font-mono mt-0.5")}>
                      /{evento.slug}
                    </div>
                  </TableCell>
                  <TableCell className={cn("hidden sm:table-cell")}>
                    <Badge variant="outline">{TYPE_LABEL[evento.type]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[evento.status]}>
                      {STATUS_LABEL[evento.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className={cn("hidden md:table-cell text-muted-foreground text-xs")}>
                    {formatDate(evento.created_at)}
                  </TableCell>
                  <TableCell className={cn("text-right")}>
                    <Tooltip>
                      <TooltipTrigger render={<span className={cn("inline-block")} />}>
                        <Link
                          href={`/cms/dashboard/eventos/${evento.id}`}
                          className={cn(
                            "text-xs font-medium text-primary hover:underline underline-offset-2",
                          )}
                        >
                          Editar
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Editar "{evento.title}"</TooltipContent>
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
