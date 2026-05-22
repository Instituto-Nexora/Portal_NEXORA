"use client";

import { useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { novaMensagemSchema, type NovaMensagemFormValues } from "./schema";
import { enviarMensagemAction, marcarMensagensComoLidasAction } from "./actions";
import type { Ticket, TicketMessage } from "@/lib/supabase/types";

type Props = {
  ticket: Ticket;
  initialMessages: TicketMessage[];
  currentUser: string;
};

const useTicketChatViewModel = ({ ticket, initialMessages, currentUser }: Props) => {
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<NovaMensagemFormValues>({
    resolver: zodResolver(novaMensagemSchema),
    defaultValues: { mensagem: "" },
  });

  useEffect(() => {
    const unreadFromAdmin = initialMessages.some(m => !m.lida && m.autor_role === "admin");
    if (unreadFromAdmin) {
      marcarMensagensComoLidasAction(ticket.id);
    }
  }, [ticket.id, initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages]);

  const onSubmit = (values: NovaMensagemFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("mensagem", values.mensagem);

      const result = await enviarMensagemAction(ticket.id, formData);

      if (result && !result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof NovaMensagemFormValues, { type: "server", message: messages[0] });
          });
        } else if (result.message) {
          form.setError("root", { type: "server", message: result.message });
        }
      } else {
        form.reset();
      }
    });
  };

  return { 
    form, isPending, onSubmit: form.handleSubmit(onSubmit), isFinished: ticket.status === "finalizado", messagesEndRef
  };
};

export default useTicketChatViewModel;