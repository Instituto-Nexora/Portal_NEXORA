"use client";

import { CheckCircle2, Clock, Loader2, Send, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket, TicketMessage, TicketStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/utils/formatDate";
import useTicketAdminChatViewModel from "./viewModel";

type Props = {
  ticket: Ticket & { aluno_nome: string };
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

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "aberto", label: "🟡 Aberto" },
  { value: "em_progresso", label: "🔵 Em Progresso" },
  { value: "finalizado", label: "🟢 Finalizado" },
];

export default function TicketAdminChatView({
  ticket,
  initialMessages,
  currentUser,
}: Props) {
  const {
    form,
    isPending,
    onSubmit,
    changeStatus,
    isFinished,
    messagesEndRef,
  } = useTicketAdminChatViewModel({ ticket, initialMessages, currentUser });
  const {
    register,
    formState: { errors },
  } = form;

  const cfg = statusConfig[ticket.status];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b bg-background/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <UserCircle className="w-5 h-5 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-semibold text-foreground truncate">
                {ticket.aluno_nome}
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
              <span className="capitalize">{ticket.topico}</span>
              {" · "}
              Aberto em {formatDate(ticket.created_at)}
              {" · "}
              <span className="font-mono">#{ticket.id.split("-")[0]}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Label
            id="status-label"
            className="text-xs text-muted-foreground whitespace-nowrap"
          >
            Status:
          </Label>
          <Select
            value={ticket.status}
            onValueChange={(v) => changeStatus(v as TicketStatus)}
            disabled={isPending}
          >
            <SelectTrigger aria-labelledby="status-label" className="w-44 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto nexora-scrollbar px-4 sm:px-6 py-6">
        <div className=" mx-auto space-y-5">
          {initialMessages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-10">
              Nenhuma mensagem encontrada.
            </p>
          ) : (
            initialMessages.map((msg) => {
              const isAdmin = msg.autor_role === "admin";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isAdmin ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                      isAdmin
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border text-card-foreground rounded-tl-sm",
                    )}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isAdmin
                            ? "text-primary-foreground/80"
                            : "text-foreground",
                        )}
                      >
                        {isAdmin ? "Suporte (Você)" : ticket.aluno_nome}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] flex items-center gap-1 ml-auto",
                          isAdmin
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
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              <p className="text-sm font-medium">
                Ticket finalizado. Altere o status acima para reabri-lo.
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
                  rows={3}
                  placeholder="Digite a resposta para o aluno... (Enter para enviar, Shift+Enter para nova linha)"
                  className="resize-none min-h-20 max-h-48 rounded-xl"
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
                aria-label="Enviar resposta"
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
