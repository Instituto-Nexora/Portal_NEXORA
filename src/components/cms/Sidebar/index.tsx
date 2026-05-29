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
import { SidebarNav } from "./SidebarNav";
import { SidebarUserMenu } from "./SidebarUserMenu";

type Props = {
  user: SessionUser;
  className?: string;
};

export function Sidebar({ user, className }: Props) {
  return (
    <SidebarRoot collapsible="icon" className={className}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger render={<span className={cn(["block"])} />}>
                <SidebarMenuButton
                  asChild
                  className={cn(["h-10 font-bold tracking-widest"])}
                >
                  <Link
                    href="/cms/dashboard"
                    aria-label="Ir para o dashboard do CMS"
                  >
                    <span
                      className={cn([
                        "flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground",
                      ])}
                    >
                      N
                    </span>
                    <span
                      className={cn([
                        "truncate group-data-[state=collapsed]/sidebar:hidden",
                      ])}
                    >
                      NEXORA CMS
                    </span>
                  </Link>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      <Separator className={cn(["bg-sidebar-border"])} />

      <SidebarFooter>
        <SidebarUserMenu user={user} />
      </SidebarFooter>
      <SidebarRail />
    </SidebarRoot>
  );
}
