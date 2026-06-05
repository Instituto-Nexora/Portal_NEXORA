import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TicketChatView from "./_features/view";

export const metadata: Metadata = {
  title: "Chat do Ticket | Suporte - NEXORA",
  description: "Acompanhe o andamento do seu ticket de suporte.",
};

export default async function TicketChatPage({ params }: { params: Promise<{ id: string }> }) {
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

  return <TicketChatView ticket={ticket} initialMessages={messages || []} currentUser={user.id} />;
}