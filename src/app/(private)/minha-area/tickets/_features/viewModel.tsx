"use client";

import { useState, useEffect } from "react";
import type { TicketListItem } from "./model";

export type TicketsListViewModel = {
  tickets: TicketListItem[];
  isLoading: boolean;
};

const useTicketsListViewModel = (): TicketsListViewModel => {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Substituir por fetch real no Supabase (Task #95)
    const mockTickets: TicketListItem[] = [
      {
        id: "ticket-123",
        aluno_id: "user-id",
        topico: "aula",
        status: "aberto",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        unreadCount: 2,
      },
      {
        id: "ticket-124",
        aluno_id: "user-id",
        topico: "curso",
        status: "finalizado",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        unreadCount: 0,
      },
      {
        id: "ticket-125",
        aluno_id: "user-id",
        topico: "cadastro",
        status: "em_progresso",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 dia atrás
        updated_at: new Date().toISOString(),
        unreadCount: 0,
      }
    ];

    // Regra de negócio: ordenar com respostas não lidas no topo, e depois por mais recentes
    const sorted = [...mockTickets].sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setTimeout(() => {
      setTickets(sorted);
      setIsLoading(false);
    }, 800); // Simulando delay de rede
  }, []);

  return { tickets, isLoading };
};

export default useTicketsListViewModel;