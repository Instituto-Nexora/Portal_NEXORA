import { Separator } from "@/components/ui/separator";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";

type Props = {
  user: SessionUser;
  className?: string;
};

export function Sidebar({ user, className }: Props) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r bg-background",
        className,
      )}
    >
      {/* Logo */}
      <div
        className={cn("flex h-14 items-center px-5 font-bold tracking-widest")}
      >
        NEXORA CMS
      </div>

      <Separator />

      {/* Navigation */}
      <div className={cn("flex-1 overflow-y-auto py-4")}>
        <SidebarNav />
      </div>

      <Separator />

      {/* User */}
      <div className={cn("py-4")}>
        <SidebarUserMenu user={user} />
      </div>
    </aside>
  );
}
