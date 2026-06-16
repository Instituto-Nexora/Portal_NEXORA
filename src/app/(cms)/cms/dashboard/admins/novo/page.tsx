import type { Metadata } from "next";
import { NovoAdminView } from "./_features/NovoAdmin/view";

export const metadata: Metadata = {
  title: "Novo Administrador — NEXORA-TI CMS",
};

export default function NovoAdminPage() {
  return <NovoAdminView />;
}
