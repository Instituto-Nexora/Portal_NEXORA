import type { Metadata } from "next";
import { NovoEventoView } from "./_features/NovoEvento/view";

export const metadata: Metadata = {
  title: "Novo Evento — NEXORA CMS",
};

export default function NovoEventoPage() {
  return <NovoEventoView />;
}
