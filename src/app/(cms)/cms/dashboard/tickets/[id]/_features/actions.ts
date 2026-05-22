"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { novaMensagemAdminSchema } from "./schema";
import type { TicketStatus } from "@/lib/supabase/types";

export async function enviarMensagemAdminAction(ticketId: string, formData: FormData) {
  const rawData = {
    mensagem: formData.get("mensagem"),
  };

  const parsed = novaMensagemAdminSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Não autenticado." };
  }

  const { data: ticket } = await supabase.from("tickets").select("aluno_id, status").eq("id", ticketId).single();
  if (!ticket) return { success: false, message: "Ticket não encontrado." };

  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    autor_id: ticket.aluno_id,
    autor_role: "admin", 
    mensagem: parsed.data.mensagem,
  });

  if (error) return { success: false, message: "Erro ao enviar mensagem." };

  if (ticket && ticket.status === "aberto") {
    await adminSupabase
        .from("tickets")
        .update({ status: "em_progresso", updated_at: new Date().toISOString() })
        .eq("id", ticketId);
  }

  revalidatePath(`/cms/dashboard/tickets/${ticketId}`);
  revalidatePath(`/cms/dashboard/tickets`);
  return { success: true };
}

export async function atualizarStatusTicketAction(ticketId: string, novoStatus: TicketStatus) {
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from("tickets").update({ status: novoStatus, updated_at: new Date().toISOString() }).eq("id", ticketId);
  
  if (error) return { success: false, message: "Erro ao atualizar status." };
  
  revalidatePath(`/cms/dashboard/tickets/${ticketId}`);
  revalidatePath(`/cms/dashboard/tickets`);
  return { success: true };
}

export async function marcarMensagensAlunoComoLidasAction(ticketId: string) {
  const supabase = await createClient();
  await supabase.from("ticket_messages").update({ lida: true }).eq("ticket_id", ticketId).eq("autor_role", "student").eq("lida", false);
  revalidatePath(`/cms/dashboard/tickets/${ticketId}`);
}