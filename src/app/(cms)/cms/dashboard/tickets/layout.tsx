import { createClient } from "@/lib/supabase/server";
import type { TicketAdminItem } from "./_features/model";
import { TicketsAdminSidebar } from "./_features/sidebar";

export default async function TicketsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*, mensagens:ticket_messages(id, lida, autor_role)")
    .order("created_at", { ascending: false });

  const tickets: TicketAdminItem[] = (ticketsData || []).map(
    (
      t: TicketAdminItem & {
        mensagens?: { lida: boolean; autor_role: string }[];
      },
    ) => {
      const mensagens = t.mensagens ?? [];
      return {
        ...t,
        aluno_nome: `Aluno #${t.aluno_id.substring(0, 5).toUpperCase()}`,
        unreadCount: mensagens.filter(
          (m) => !m.lida && m.autor_role === "student",
        ).length,
        total_mensagens: mensagens.length,
      };
    },
  );

  tickets.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });

  return (
    <div className="-m-4 sm:-m-6 h-[calc(100svh-3.5rem)] flex overflow-hidden bg-background">
      <TicketsAdminSidebar initialTickets={tickets} />
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}
