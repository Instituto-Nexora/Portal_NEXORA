import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  Sidebar as SidebarRoot,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { PrivateSidebarNav } from "./PrivateSidebarNav";
import { PrivateSidebarUserMenu } from "./PrivateSidebarUserMenu";

type Props = {
  user: SessionUser;
  className?: string;
};

export function PrivateSidebar({ user, className }: Props) {
  return (
    <SidebarRoot collapsible="icon" className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger render={<span className={cn("block")} />}>
                <SidebarMenuButton
                  asChild
                  className={cn("h-10 font-bold tracking-widest")}
                >
                  <Link href="/minha-area" aria-label="Ir para minha área">
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground",
                      )}
                    >
                      N
                    </span>
                    <span
                      className={cn(
                        "truncate group-data-[state=collapsed]/sidebar:hidden",
                      )}
                    >
                      NEXORA TI
                    </span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Minha Área</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <PrivateSidebarNav />
      </SidebarContent>

      <Separator className={cn("bg-sidebar-border")} />

      <SidebarFooter>
        <PrivateSidebarUserMenu user={user} />
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}
