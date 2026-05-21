import { createClient } from "@/lib/supabase/server";

export async function UnreadTicketsBadge() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { count } = await supabase
    .from("ticket_messages")
    .select("*", { count: "exact", head: true })
    .eq("lida", false)
    .neq("autor_id", user.id);

  if (!count || count === 0) return null;

  return (
    <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm" aria-label={`${count} mensagens não lidas`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}