import { Inbox } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestão de Tickets | CMS - NEXORA",
  description: "Gerencie os tickets de suporte dos alunos.",
};

export default function TicketsAdminPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Inbox className="w-8 h-8 text-primary" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">
          Selecione um ticket
        </h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Escolha um ticket na lista ao lado para visualizar e responder ao
          chamado.
        </p>
      </div>
    </div>
  );
}
