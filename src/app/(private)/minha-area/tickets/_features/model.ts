import type { Ticket } from "@/lib/supabase/types";

export type TicketListItem = Ticket & {
  // Campo virtual para a UI (geralmente calculado via count ou field derivado do backend)
  unreadCount: number;
};