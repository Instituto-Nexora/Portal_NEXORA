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
        "flex h-full shrink-0 flex-col border-r bg-background",
        "w-60",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center font-bold tracking-widest px-4",
        )}
      >
        <span >NEXORA CMS</span>
      </div>

      <Separator />

      <div className={cn("flex-1 overflow-y-auto py-4")}>
        <SidebarNav />
      </div>

      <Separator />

      <div className={cn("py-4")}>
        <SidebarUserMenu user={user}  />
      </div>
    </aside>
  );
}
