"use client";

import Link from "next/link";
import { ArrowLeft, Send, Loader2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/formatDate";
import useTicketChatViewModel from "./viewModel";
import type { Ticket, TicketMessage, TicketStatus } from "@/lib/supabase/types";

type Props = {
  ticket: Ticket;
  initialMessages: TicketMessage[];
  currentUser: string;
};

const statusMap: Record<TicketStatus, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "bg-amber-100 text-amber-800 border-amber-200" },
  em_progresso: { label: "Em Progresso", color: "bg-blue-100 text-blue-800 border-blue-200" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

export default function TicketChatView({ ticket, initialMessages, currentUser }: Props) {
  const { form, isPending, onSubmit, isFinished, messagesEndRef } = useTicketChatViewModel({ ticket, initialMessages, currentUser });
  const { register, formState: { errors } } = form;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-120px)]">
      {/* Cabeçalho do Ticket */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="shrink-0 text-teal-950">
            <Link href="/minha-area/tickets" aria-label="Voltar para a lista de tickets">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-teal-950 capitalize">{ticket.topico}</h1>
              <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", statusMap[ticket.status].color)}>
                {statusMap[ticket.status].label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Aberto em {formatDate(ticket.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Área de Histórico (Scroll) */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 nexora-scrollbar pr-2">
        {initialMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">Nenhuma mensagem encontrada.</div>
        ) : (
          initialMessages.map((msg) => {
            const isMe = msg.autor_id === currentUser;
            return (
              <div key={msg.id} className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 flex flex-col gap-1 shadow-sm",
                  isMe ? "bg-teal-600 text-white rounded-tr-sm" : "bg-white border text-teal-950 rounded-tl-sm"
                )}>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className={cn("text-xs font-bold", isMe ? "text-teal-100" : "text-teal-700")}>
                      {isMe ? "Você" : "Suporte Nexora"}
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1", isMe ? "text-teal-200" : "text-gray-400")}>
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {formatDate(msg.created_at)} às {formatTime(msg.created_at)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.mensagem}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Caixa de Texto / Footer */}
      <div className="shrink-0 pt-4 border-t bg-muted/40 sm:bg-transparent">
        {isFinished ? (
          <div className="bg-gray-50 border rounded-lg p-4 flex items-center justify-center gap-2 text-gray-600">
            <CheckCircle2 className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <p className="text-sm font-medium">Este ticket foi finalizado e não aceita novas mensagens.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              {errors.root && <p className="text-xs text-red-600 font-medium mb-1 px-1">{errors.root.message}</p>}
              <textarea
                rows={2}
                placeholder="Digite sua mensagem..."
                className={cn(
                  "flex w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[60px] transition-colors",
                  errors.mensagem ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                )}
                {...register("mensagem")}
                disabled={isPending}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
              />
            </div>
            <Button type="submit" size="icon" className="h-[60px] w-[60px] shrink-0 bg-amber-500 hover:bg-amber-400 text-teal-950 transition-colors rounded-md" disabled={isPending} aria-label="Enviar mensagem">
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}