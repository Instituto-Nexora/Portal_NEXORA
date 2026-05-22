import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TicketsAdminView from "./_features/view";
import type { TicketAdminItem } from "./_features/model";

export const metadata: Metadata = {
  title: "Gestão de Tickets | CMS - NEXORA",
  description: "Gerencie os tickets de suporte dos alunos.",
};

export default async function TicketsAdminPage() {
  const supabase = await createClient();

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select(`
      *,
      mensagens:ticket_messages(id, lida, autor_role)
    `)
    .order("created_at", { ascending: false });

  const formattedTickets: TicketAdminItem[] = (ticketsData || []).map((t: any) => {
    const mensagens = t.mensagens || [];
    
    const unreadCount = mensagens.filter((m: any) => !m.lida && m.autor_role === 'student').length;

    return {
      ...t,
      aluno_nome: `Aluno #${t.aluno_id.substring(0, 5).toUpperCase()}`,
      unreadCount,
      total_mensagens: mensagens.length
    };
  });

  formattedTickets.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0; 
  });

  return <TicketsAdminView initialTickets={formattedTickets} />;
}