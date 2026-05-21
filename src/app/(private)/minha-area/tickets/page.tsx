import type { Metadata } from "next";
import { Suspense } from "react";
import TicketsListView from "./_features";

export const metadata: Metadata = {
  title: "Meus Tickets | Suporte - NEXORA",
  description: "Acompanhe seus tickets de suporte na Área do Aluno.",
};

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="p-6 md:p-10 text-muted-foreground">Carregando tickets...</div>}>
      <TicketsListView />
    </Suspense>
  );
}