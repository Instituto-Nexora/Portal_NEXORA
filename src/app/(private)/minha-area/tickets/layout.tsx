import { createClient } from "@/lib/supabase/server";
import type { TicketListItem } from "./_features/model";
import { TicketsSidebar } from "./_features/sidebar";

export default async function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <>{children}</>;

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*, mensagens:ticket_messages(id, lida, autor_id)")
    .eq("aluno_id", user.id)
    .order("created_at", { ascending: false });

  const tickets: TicketListItem[] = (ticketsData || []).map(
    (
      t: TicketListItem & { mensagens?: { lida: boolean; autor_id: string }[] },
    ) => {
      const mensagens = t.mensagens ?? [];
      const unreadCount = mensagens.filter(
        (m) => !m.lida && m.autor_id !== user.id,
      ).length;
      return { ...t, unreadCount };
    },
  );

  tickets.sort((a, b) => {
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    return 0;
  });

  return (
    <div className="-m-4 sm:-m-6 h-[calc(100svh-3.5rem)] flex overflow-hidden bg-background">
      <TicketsSidebar tickets={tickets} />
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col mx-5 ">
        {children}
      </div>
    </div>
  );
}
