"use client";

import { CheckCircle2, Clock, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket, TicketMessage, TicketStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/formatDate";
import useTicketChatViewModel from "./viewModel";

type Props = {
  ticket: Ticket;
  initialMessages: TicketMessage[];
  currentUser: string;
};

const statusConfig: Record<TicketStatus, { label: string; color: string }> = {
  aberto: {
    label: "Aberto",
    color:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  em_progresso: {
    label: "Em Progresso",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  finalizado: {
    label: "Finalizado",
    color: "bg-muted text-muted-foreground border-border",
  },
};

export default function TicketChatView({
  ticket,
  initialMessages,
  currentUser: _currentUser,
}: Props) {
  const { form, isPending, onSubmit, isFinished, messagesEndRef } =
    useTicketChatViewModel({
      ticket,
      initialMessages,
      currentUser: _currentUser,
    });
  const {
    register,
    formState: { errors },
  } = form;

  const cfg = statusConfig[ticket.status];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b bg-background/80 backdrop-blur-sm flex items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-lg font-semibold text-foreground capitalize truncate">
              {ticket.topico}
            </h1>
            <span
              className={cn(
                "text-xs font-medium px-2.5 py-0.5 rounded-full border shrink-0",
                cfg.color,
              )}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Aberto em {formatDate(ticket.created_at)}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto nexora-scrollbar px-4 sm:px-6 py-6">
        <div className="mx-auto space-y-5">
          {initialMessages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-10">
              Nenhuma mensagem encontrada.
            </p>
          ) : (
            initialMessages.map((msg) => {
              const isMe = msg.autor_role === "student";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isMe ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-card-foreground rounded-tl-sm",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isMe
                            ? "text-primary-foreground/80"
                            : "text-foreground",
                        )}
                      >
                        {isMe ? "Você" : "Suporte Nexora"}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] flex items-center gap-1 ml-auto",
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground",
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.created_at)} às{" "}
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {msg.mensagem}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t bg-background/80 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {isFinished ? (
            <div className="bg-muted border rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">
                Este ticket foi finalizado e não aceita novas mensagens.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                {errors.root && (
                  <p className="text-xs text-destructive font-medium mb-1">
                    {errors.root.message}
                  </p>
                )}
                <Textarea
                  rows={2}
                  placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                  className="resize-none min-h-14 max-h-40 rounded-xl"
                  {...register("mensagem")}
                  disabled={isPending}
                  aria-invalid={!!errors.mensagem}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="size-14 shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isPending}
                aria-label="Enviar mensagem"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
