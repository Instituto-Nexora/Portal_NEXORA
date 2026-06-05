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
    <span className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm" >
      {count > 99 ? "99+" : count}
    </span>
  );
}