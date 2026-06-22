"use client";

import { AlertCircle, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const statusDot: Record<TicketStatus, string> = {
  aberto: "bg-amber-500",
  em_progresso: "bg-blue-500",
  finalizado: "bg-muted-foreground/40",
};

const statusLabel: Record<TicketStatus, string> = {
  aberto: "Aberto",
  em_progresso: "Em Progresso",
  finalizado: "Finalizado",
};

const STATUS_OPTIONS: { value: TicketStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "aberto", label: "Aberto" },
  { value: "em_progresso", label: "Em Prog." },
  { value: "finalizado", label: "Finalizado" },
];

const TOPIC_OPTIONS: { value: TicketTopic | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "aula", label: "Aula" },
  { value: "cadastro", label: "Cadastro" },
  { value: "curso", label: "Curso" },
  { value: "eventos", label: "Eventos" },
  { value: "reclamacao", label: "Reclamação" },
];

type Props = {
  initialTickets: TicketAdminItem[];
};

export function TicketsAdminSidebar({ initialTickets }: Props) {
  const pathname = usePathname();
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
    <aside className="w-80 border-r flex flex-col overflow-hidden bg-sidebar shrink-0">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sidebar-foreground text-sm tracking-tight">
            Gestão de Tickets
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {tickets.length} resultado{tickets.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar aluno ou ID..."
            className="pl-8 h-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as TicketStatus | "todos")}
          >
            <SelectTrigger size="sm" className="flex-1 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={topicFilter}
            onValueChange={(v) => setTopicFilter(v as TicketTopic | "todos")}
          >
            <SelectTrigger size="sm" className="flex-1 text-xs">
              <SelectValue placeholder="Tópico" />
            </SelectTrigger>
            <SelectContent>
              {TOPIC_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-xs"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto nexora-scrollbar">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center gap-3">
            <MessageSquare className="w-9 h-9 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Nenhum ticket encontrado.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isActive = pathname === `/cms/dashboard/tickets/${ticket.id}`;
            return (
              <Link
                key={ticket.id}
                href={`/cms/dashboard/tickets/${ticket.id}`}
                className={cn(
                  "relative flex flex-col gap-1.5 px-4 py-3 border-b transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-muted/50 text-foreground",
                )}
              >
                {ticket.unreadCount > 0 && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-destructive rounded-r" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate">
                    {ticket.aluno_nome}
                  </span>
                  {ticket.unreadCount > 0 && (
                    <span className="flex items-center shrink-0 gap-0.5 text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      {ticket.unreadCount}
                    </span>
                  )}
                </div>

                <span className="text-xs text-muted-foreground capitalize truncate">
                  {ticket.topico}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      statusDot[ticket.status],
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {statusLabel[ticket.status]}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
