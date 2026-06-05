"use client";

import { Clock, Eye, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TicketStatus, TicketTopic } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import type { TicketAdminItem } from "./model";
import useTicketsAdminViewModel from "./viewModel";

const statusMap: Record<TicketStatus, { label: string; color: string }> = {
  aberto: {
    label: "Aberto",
    color:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  em_progresso: {
    label: "Em Progresso",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  finalizado: {
    label: "Finalizado",
    color: "bg-muted text-muted-foreground border-border",
  },
};

const STATUS_OPTIONS: { value: TicketStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os Status" },
  { value: "aberto", label: "Aberto" },
  { value: "em_progresso", label: "Em Progresso" },
  { value: "finalizado", label: "Finalizado" },
];

const TOPIC_OPTIONS: { value: TicketTopic | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os Tópicos" },
  { value: "aula", label: "Aula" },
  { value: "cadastro", label: "Cadastro" },
  { value: "curso", label: "Curso" },
  { value: "eventos", label: "Eventos" },
  { value: "reclamacao", label: "Reclamação" },
];

export default function TicketsAdminView({
  initialTickets,
}: {
  initialTickets: TicketAdminItem[];
}) {
  const {
    tickets,
    statusFilter,
    setStatusFilter,
    topicFilter,
    setTopicFilter,
    searchTerm,
    setSearchTerm,
  } = useTicketsAdminViewModel(initialTickets);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestão de Tickets
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie e responda aos chamados de suporte dos alunos.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar por ID ou nome do aluno..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as TicketStatus | "todos")}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={topicFilter}
            onValueChange={(v) => setTopicFilter(v as TicketTopic | "todos")}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Tópico" />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">
              Nenhum ticket encontrado.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Tente ajustar os filtros acima.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1.5 shrink-0">
                    {ticket.unreadCount > 0 ? (
                      <div
                        className="h-2 w-2 rounded-full bg-destructive animate-pulse"
                        title="Nova mensagem não lida"
                      />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-foreground">
                        {ticket.aluno_nome}
                      </span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="text-sm font-semibold capitalize text-foreground">
                        {ticket.topico}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border",
                          statusMap[ticket.status].color,
                        )}
                      >
                        {statusMap[ticket.status].label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(ticket.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {ticket.total_mensagens} interações
                      </span>
                      <span className="font-mono text-muted-foreground/50 truncate w-24 sm:w-auto">
                        ID: {ticket.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-auto">
                  <Link href={`/cms/dashboard/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Analisar Ticket
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
