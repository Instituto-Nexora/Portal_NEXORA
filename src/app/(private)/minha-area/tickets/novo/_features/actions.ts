"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { novoTicketSchema } from "./schema";

export async function createTicketAction(formData: FormData) {
  const rawData = {
    topico: formData.get("topico"),
    mensagem: formData.get("mensagem"),
  };

  // Validação Zod no Servidor
  const parsed = novoTicketSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Sessão expirada ou usuário não autenticado." };
  }

  // 1. Criar o Ticket
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({ aluno_id: user.id, topico: parsed.data.topico, status: "aberto" })
    .select()
    .single();

  console.log(ticketError)

  if (ticketError || !ticket) {
    return { success: false, message: "Houve um problema ao abrir o ticket. Tente novamente mais tarde." };
  }

  // 2. Inserir a primeira mensagem (do Aluno)
  const { error: msgError } = await supabase
    .from("ticket_messages")
    .insert({ ticket_id: ticket.id, autor_id: user.id, autor_role: "student", mensagem: parsed.data.mensagem });

  if (msgError) {
    return { success: false, message: "O ticket foi aberto, mas houve um erro ao salvar a mensagem inicial." };
  }

  // Redireciona o usuário para o Chat deste novo Ticket
  redirect(`/minha-area/tickets/${ticket.id}`);
}