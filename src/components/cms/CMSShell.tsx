import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type Props = {
  user: SessionUser;
  children: React.ReactNode;
};

export function CMSShell({ user, children }: Props) {
  return (
    <TooltipProvider>
      <div className={cn("flex h-screen overflow-hidden")}>
        <Sidebar user={user} className={cn("sticky top-0 h-screen")} />

        <div className={cn("flex flex-1 flex-col overflow-hidden")}>
          <TopBar />

          <main className={cn("flex-1 overflow-y-auto p-6")}>{children}</main>
        </div>
      </div>
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
