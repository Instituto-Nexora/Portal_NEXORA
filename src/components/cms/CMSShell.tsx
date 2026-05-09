import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { CMSMobileSidebar } from "./CMSMobileSidebar";
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
        <Sidebar
          user={user}
          variant="compact"
          className={cn("sticky top-0 hidden h-screen lg:flex")}
        />

        <div className={cn("flex flex-1 flex-col overflow-hidden")}>
          <TopBar mobileNav={<CMSMobileSidebar user={user} />} />

          <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6")}>
            {children}
          </main>
        </div>
      </div>
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
