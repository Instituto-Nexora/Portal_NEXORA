import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PrivateSidebarNav } from "./PrivateSidebarNav";
import { PrivateSidebarUserMenu } from "./PrivateSidebarUserMenu";
import type { SessionUser } from "@/lib/supabase/types";

type Props = {
  user: SessionUser;
  className?: string;
};

export function PrivateSidebar({ user, className }: Props) {

  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col bg-background border-r",
        className,
      )}
    >
      {/* Logo */}
      <div className={cn("flex h-14 items-center px-5")}>
          <p className="text-xl">NEXORA TI</p>
      </div>

      <Separator />

      {/* Navigation */}
      <div className={cn("flex-1 overflow-y-auto py-4")}>
        <PrivateSidebarNav />
      </div>

      <Separator />

      {/* User Menu Footer */}
      <div className={cn("py-4")}>
        <PrivateSidebarUserMenu user={user} />
      </div>
    </aside>
  );
}
