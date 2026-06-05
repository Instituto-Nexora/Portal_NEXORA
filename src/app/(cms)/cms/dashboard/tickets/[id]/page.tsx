import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TicketAdminChatView from "./_features/view";

export const metadata: Metadata = {
  title: "Detalhes do Ticket | CMS - NEXORA",
  description: "Visualize e responda ao chamado de suporte.",
};

export default async function TicketAdminChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", id).single();

  if (!ticket) {
    notFound();
  }

  const { data: messages } = await supabase.from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticket.id)
    .order("created_at", { ascending: true });

  const ticketWithStudent = { ...ticket, aluno_nome: `Aluno #${ticket.aluno_id.substring(0, 5).toUpperCase()}` };

  return <TicketAdminChatView ticket={ticketWithStudent} initialMessages={messages || []} currentUser={user.id} />;
}
