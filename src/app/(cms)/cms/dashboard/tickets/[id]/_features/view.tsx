"use client";

import Link from "next/link";
import { ArrowLeft, Send, Loader2, Clock, CheckCircle2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/formatDate";
import useTicketAdminChatViewModel from "./viewModel";
import type { Ticket, TicketMessage, TicketStatus } from "@/lib/supabase/types";

type Props = {
  ticket: Ticket & { aluno_nome: string };
  initialMessages: TicketMessage[];
  currentUser: string;
};

export default function TicketAdminChatView({ ticket, initialMessages, currentUser }: Props) {
  const { form, isPending, onSubmit, changeStatus, isFinished, messagesEndRef } = useTicketAdminChatViewModel({ ticket, initialMessages, currentUser });
  const { register, formState: { errors } } = form;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-60px)]">
      {/* Cabeçalho do Ticket Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0 bg-card p-4 rounded-t-xl shadow-sm">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" className="shrink-0 text-foreground mt-1">
            <Link href="/cms/dashboard/tickets" aria-label="Voltar para a lista de tickets">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserCircle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <h1 className="text-xl font-bold text-foreground">{ticket.aluno_nome}</h1>
            </div>
            <p className="text-sm font-medium text-muted-foreground capitalize">
              Assunto: {ticket.topico}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Aberto em {formatDate(ticket.created_at)} • ID: {ticket.id.split('-')[0]}
            </p>
          </div>
        </div>

        {/* Seletor de Status */}
        <div className="flex items-center gap-3 bg-muted p-2 rounded-lg border border-border">
          <label htmlFor="status-select" className="text-sm font-semibold text-foreground">Status:</label>
          <select
            id="status-select"
            value={ticket.status}
            onChange={(e) => changeStatus(e.target.value as TicketStatus)}
            disabled={isPending}
            className="bg-background border border-border text-foreground text-sm rounded-md px-3 py-1.5 focus-visible:ring-2 focus-visible:ring-primary outline-none font-medium cursor-pointer shadow-sm min-w-[140px]"
          >
            <option value="aberto">🟡 Aberto</option>
            <option value="em_progresso">🔵 Em Progresso</option>
            <option value="finalizado">🟢 Finalizado</option>
          </select>
        </div>
      </div>

      {/* Área de Histórico (Scroll) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background/50 space-y-6 nexora-scrollbar pr-2 border-x border-border shadow-inner">
        {initialMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">Nenhuma mensagem encontrada.</div>
        ) : (
          initialMessages.map((msg) => {
            const isAdmin = msg.autor_role === "admin";
            return (
              <div key={msg.id} className={cn("flex w-full", isAdmin ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[90%] sm:max-w-[75%] rounded-2xl p-4 flex flex-col gap-1 shadow-sm",
                  isAdmin ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border text-card-foreground rounded-tl-sm"
                )}>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className={cn("text-xs font-bold", isAdmin ? "text-primary-foreground/90" : "text-foreground")}>
                      {isAdmin ? "Suporte (Você)" : ticket.aluno_nome}
                    </span>
                    <span className={cn("text-[10px] flex items-center gap-1", isAdmin ? "text-primary-foreground/70" : "text-muted-foreground")}>
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
      <div className="shrink-0 p-4 border-x border-b border-border bg-card rounded-b-xl shadow-sm">
        {isFinished ? (
          <div className="bg-muted border border-border border-dashed rounded-lg p-4 flex items-center justify-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-green-500" aria-hidden="true" />
            <p className="text-sm font-medium">Este ticket foi finalizado. Altere o status acima para reabri-lo se necessário.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              {errors.root && <p className="text-xs text-destructive font-medium mb-1 px-1">{errors.root.message}</p>}
              <textarea
                rows={3}
                placeholder="Digite a resposta para o aluno..."
                className={cn(
                  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[80px] transition-colors",
                  errors.mensagem ? "border-destructive focus-visible:ring-destructive" : "border-input"
                )}
                {...register("mensagem")}
                disabled={isPending}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); } }}
              />
            </div>
            <Button type="submit" className="h-auto sm:h-[80px] w-full sm:w-[100px] shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground transition-colors font-bold rounded-md" disabled={isPending} aria-label="Enviar resposta">
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="mr-2 h-5 w-5" aria-hidden="true" />}
              Enviar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}