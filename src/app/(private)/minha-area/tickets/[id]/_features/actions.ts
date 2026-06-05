"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { novaMensagemSchema } from "./schema";

export async function enviarMensagemAction(ticketId: string, formData: FormData) {
  const rawData = {
    mensagem: formData.get("mensagem"),
  };

  const parsed = novaMensagemSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Não autenticado." };
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select("status")
    .eq("id", ticketId)
    .single();
  
  if (!ticket) return { success: false, message: "Ticket não encontrado." };
  if (ticket.status === "finalizado") return { success: false, message: "Este ticket já foi finalizado." };

  const { error } = await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    autor_id: user.id,
    autor_role: "student",
    mensagem: parsed.data.mensagem,
  });

  if (error) return { success: false, message: "Erro ao enviar mensagem." };

  revalidatePath(`/minha-area/tickets/${ticketId}`);
  return { success: true };
}

export async function marcarMensagensComoLidasAction(ticketId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("ticket_messages")
    .update({ lida: true })
    .eq("ticket_id", ticketId)
    .eq("autor_role", "admin")
    .eq("lida", false);
    
  revalidatePath(`/minha-area/tickets/${ticketId}`);
  revalidatePath(`/minha-area/tickets`); 
}