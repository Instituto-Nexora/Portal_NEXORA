"use client";

import { AlertCircle, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { TicketStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import type { TicketListItem } from "./model";

const statusConfig: Record<TicketStatus, { label: string; dot: string }> = {
  aberto: { label: "Aberto", dot: "bg-amber-500" },
  em_progresso: { label: "Em Progresso", dot: "bg-blue-500" },
  finalizado: { label: "Finalizado", dot: "bg-muted-foreground/50" },
};

type Props = {
  tickets: TicketListItem[];
};

export function TicketsSidebar({ tickets }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r flex flex-col overflow-hidden bg-sidebar shrink-0">
      <div className="px-4 py-4 border-b shrink-0 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sidebar-foreground text-sm tracking-tight">
            Meus Tickets
          </h2>
          <Link href="/minha-area/tickets/novo">
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto nexora-scrollbar">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-10 text-center gap-3">
            <MessageCircle className="w-9 h-9 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">
              Nenhum ticket aberto ainda.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isActive = pathname === `/minha-area/tickets/${ticket.id}`;
            const cfg = statusConfig[ticket.status];
            return (
              <Link
                key={ticket.id}
                href={`/minha-area/tickets/${ticket.id}`}
                className={cn(
                  "relative flex flex-col gap-1.5 px-4 py-3.5 border-b transition-colors",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-muted/50 text-foreground",
                )}
              >
                {ticket.unreadCount > 0 && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-destructive rounded-r" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium capitalize truncate">
                    {ticket.topico}
                  </span>
                  {ticket.unreadCount > 0 && (
                    <span className="flex items-center shrink-0 gap-0.5 text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      {ticket.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {cfg.label}
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
