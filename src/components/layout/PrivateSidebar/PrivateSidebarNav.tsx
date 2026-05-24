"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Minha Área",
    href: "/minha-area",
    icon: LayoutDashboard,
    exact: true,
  },
];

export function PrivateSidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Área do Aluno</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            const item = (
              <SidebarMenuButton asChild isActive={active} title={label}>
                <Link href={href} aria-current={active ? "page" : undefined}>
                  <Icon className={cn("size-4")} aria-hidden="true" />
                  <span
                    className={cn(
                      "group-data-[state=collapsed]/sidebar:hidden",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={href}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger render={<span className={cn("block")} />}>
                      {item}
                    </TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                ) : (
                  item
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
