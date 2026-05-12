import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CMSIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/cms/login");
  }

  redirect("/cms/dashboard");
}
