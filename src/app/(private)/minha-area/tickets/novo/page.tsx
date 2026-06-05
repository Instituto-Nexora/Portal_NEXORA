import type { Metadata } from "next";
import NovoTicketView from "./_features/view";

export const metadata: Metadata = {
  title: "Novo Ticket | Suporte - NEXORA",
  description: "Abra um novo ticket de suporte para obter ajuda com a plataforma Nexora.",
};

export default function NovoTicketPage() {
  return <NovoTicketView />;
}