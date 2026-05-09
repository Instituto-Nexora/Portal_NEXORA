import { Separator } from "@/components/ui/separator";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";

type Props = {
  user: SessionUser;
  variant?: "full" | "compact";
  className?: string;
};

export function Sidebar({ user, variant = "full", className }: Props) {
  const isCompact = variant === "compact";

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-background",
        isCompact ? "w-16" : "w-60",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center font-bold tracking-widest",
          isCompact ? "justify-center px-2 text-sm" : "px-5",
        )}
      >
        <span className={cn(isCompact && "sr-only")}>NEXORA CMS</span>
        {isCompact && <span aria-hidden="true">NX</span>}
      </div>

      <Separator />

      <div className={cn("flex-1 overflow-y-auto py-4")}>
        <SidebarNav showLabels={!isCompact} />
      </div>

      <Separator />

      <div className={cn("py-4")}>
        <SidebarUserMenu user={user} compact={isCompact} />
      </div>
    </aside>
  );
}
