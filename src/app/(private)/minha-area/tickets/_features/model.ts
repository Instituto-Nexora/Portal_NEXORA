import type { Ticket } from "@/lib/supabase/types";

export type TicketListItem = Ticket & {
  unreadCount: number;
};