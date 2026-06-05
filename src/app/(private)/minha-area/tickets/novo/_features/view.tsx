"use client";

import { Loader2, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TicketForm } from "../../_features/ticket-form";
import useNovoTicketViewModel from "./viewModel";

export default function NovoTicketView() {
  const { form, isPending, onSubmit } = useNovoTicketViewModel();

  return (
    <div className="flex flex-col h-full overflow-y-auto nexora-scrollbar">
      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 py-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Ticket</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Descreva sua necessidade. Nossa equipe responderá em breve.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <TicketForm form={form} isPending={isPending} />

          <div className="flex items-center gap-3 pt-2">
            <Link href="/minha-area/tickets">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              className={cn(
                "min-w-35 gap-2",
                "bg-amber-500 hover:bg-amber-400 text-teal-950 font-bold",
              )}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isPending ? "Processando..." : "Abrir Chamado"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
