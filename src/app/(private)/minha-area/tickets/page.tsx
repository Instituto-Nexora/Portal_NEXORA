import { MessageSquarePlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Meus Tickets | Suporte - NEXORA",
  description: "Acompanhe seus tickets de suporte na Área do Aluno.",
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <MessageSquarePlus className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">
          Selecione um ticket
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Escolha um ticket na lista ao lado ou abra um novo chamado de suporte.
        </p>
      </div>
      <Link href="/minha-area/tickets/novo">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Abrir novo ticket
        </Button>
      </Link>
    </div>
  );
}
