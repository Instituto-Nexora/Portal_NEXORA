import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import TicketsListView from "./_features";
import type { TicketListItem } from "./_features/model";

export const metadata: Metadata = {
  title: "Meus Tickets | Suporte - NEXORA",
  description: "Acompanhe seus tickets de suporte na Área do Aluno.",
};

export default async function TicketsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select(`
      *,
      mensagens:ticket_messages(id, lida, autor_id)
    `)
    .eq("aluno_id", user.id)
    .order("created_at", { ascending: false });

  const formattedTickets: TicketListItem[] = (ticketsData || []).map((t: any) => {
    const mensagens = t.mensagens || [];
    const unreadCount = mensagens.filter((m: any) => !m.lida && m.autor_id !== user.id).length;
    return { ...t, unreadCount };
  });

  formattedTickets.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });

  return (
    <Suspense fallback={<div className="p-6 md:p-10 text-muted-foreground">Carregando tickets...</div>}>
      <TicketsListView initialTickets={formattedTickets} />
    </Suspense>
  );
}