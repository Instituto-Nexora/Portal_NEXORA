import type { Ticket } from "@/lib/supabase/types";

export type TicketAdminItem = Ticket & {
  aluno_nome: string;
  unreadCount: number;
  total_mensagens: number;
};