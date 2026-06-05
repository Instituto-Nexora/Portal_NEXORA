import { Sidebar as CMSAppSidebar } from "@/components/cms/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";

type Props = {
  user: SessionUser;
  children: React.ReactNode;
};

export function CMSShell({ user, children }: Props) {
  return (
    <TooltipProvider>
      <SidebarProvider className={cn(["h-svh overflow-hidden"])}>
        <CMSAppSidebar user={user} />
        <SidebarInset>
          <TopBar />
          <div
            className={cn([
              "nexora-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
            ])}
          >
            <main
              className={cn(["mx-auto min-w-0 w-full  p-4 sm:p-6"])}
            >
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
