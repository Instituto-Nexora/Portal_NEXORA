"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, ChevronRight, AlertCircle } from "lucide-react";
import useTicketsListViewModel from "./viewModel";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import type { TicketStatus } from "@/lib/supabase/types";
import type { TicketListItem } from "./model";

const statusMap: Record<TicketStatus, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "bg-amber-100 text-amber-800 border-amber-200" },
  em_progresso: { label: "Em Progresso", color: "bg-blue-100 text-blue-800 border-blue-200" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

export default function TicketsListView({ initialTickets }: { initialTickets: TicketListItem[] }) {
  const { tickets } = useTicketsListViewModel(initialTickets);

  return (
    <div className="p-6 md:p-10  mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-teal-950">Meus Tickets</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe suas solicitações de suporte e histórico de atendimento.
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-400 text-teal-950 font-bold transition-colors">
          <Link href="/minha-area/tickets/novo">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo Ticket
          </Link>
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-gray-50">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" aria-hidden="true" />
          <p className="text-muted-foreground mb-4">Você ainda não possui nenhum ticket de suporte aberto.</p>
          <Button variant="outline" className="border-teal-900 text-teal-900 hover:bg-teal-50">
            <Link href="/minha-area/tickets/novo">Abrir primeiro ticket</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/minha-area/tickets/${ticket.id}`}
              className="block border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              {ticket.unreadCount > 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-teal-950 capitalize">
                      {ticket.topico}
                    </span>
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full border", statusMap[ticket.status].color)}>
                      {statusMap[ticket.status].label}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Aberto em {formatDate(ticket.created_at)}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {ticket.unreadCount > 0 && (
                    <span className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      {ticket.unreadCount} nova{ticket.unreadCount > 1 ? 's' : ''}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}