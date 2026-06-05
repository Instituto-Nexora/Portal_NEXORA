import { redirect } from "next/navigation";
import { CMSShell } from "@/components/cms/CMSShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/cms/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const sessionUser = {
    id: user.id,
    email: user.email ?? "",
    profile: profile ?? null,
  };

  return <CMSShell user={sessionUser}>{children}</CMSShell>;
}
