import { redirect } from "next/navigation";
import { PrivateHeader } from "@/components/layout/PrivateHeader";
import { PrivateSidebar } from "@/components/layout/PrivateSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const sessionUser = {
    id: user.id,
    email: user.email ?? "",
    profile: profile ?? null,
    full_name: profile?.full_name ?? "",
  };

  return (
    <TooltipProvider>
      <SidebarProvider className={cn("h-svh overflow-hidden")}>
        <PrivateSidebar user={sessionUser} />
        <SidebarInset>
          <PrivateHeader user={sessionUser} />
          <div className={cn("nexora-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-muted/40")}>
            <main className={cn("mx-auto min-w-0 w-full max-w-7xl p-4 sm:p-6")}>
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
