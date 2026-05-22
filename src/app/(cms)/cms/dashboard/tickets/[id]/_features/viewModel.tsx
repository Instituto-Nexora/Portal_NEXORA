"use client";

import { useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { novaMensagemAdminSchema, type NovaMensagemAdminFormValues } from "./schema";
import { enviarMensagemAdminAction, atualizarStatusTicketAction, marcarMensagensAlunoComoLidasAction } from "./actions";
import type { Ticket, TicketMessage, TicketStatus } from "@/lib/supabase/types";

type Props = {
  ticket: Ticket & { aluno_nome: string };
  initialMessages: TicketMessage[];
  currentUser: string;
};

const useTicketAdminChatViewModel = ({ ticket, initialMessages, currentUser }: Props) => {
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<NovaMensagemAdminFormValues>({
    resolver: zodResolver(novaMensagemAdminSchema),
    defaultValues: { mensagem: "" },
  });

  useEffect(() => {
    const unreadFromStudent = initialMessages.some(m => !m.lida && m.autor_role === "student");
    if (unreadFromStudent) {
      marcarMensagensAlunoComoLidasAction(ticket.id);
    }
  }, [ticket.id, initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  const onSubmit = (values: NovaMensagemAdminFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("mensagem", values.mensagem);

      const result = await enviarMensagemAdminAction(ticket.id, formData);

      if (result && !result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof NovaMensagemAdminFormValues, { type: "server", message: messages[0] });
          });
        } else if (result.message) {
          form.setError("root", { type: "server", message: result.message });
        }
      } else {
        form.reset();
      }
    });
  };

  const changeStatus = (newStatus: TicketStatus) => {
    startTransition(async () => {
      await atualizarStatusTicketAction(ticket.id, newStatus);
    });
  };

  return { 
    form, isPending, onSubmit: form.handleSubmit(onSubmit), changeStatus, isFinished: ticket.status === "finalizado", messagesEndRef
  };
};

export default useTicketAdminChatViewModel;
