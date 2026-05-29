"use client";

import {
  BookOpen,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
  TicketIcon,
} from "lucide-react";
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
    label: "Dashboard",
    href: "/cms/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Conteúdos", href: "/cms/contents", icon: FileText, exact: false },
  { label: "Cursos", href: "/cms/courses", icon: BookOpen, exact: false },
  {
    label: "Administradores",
    href: "/cms/dashboard/admins",
    icon: ShieldCheck,
    exact: false,
  },
  {
    label: "Eventos",
    href: "/cms/dashboard/eventos",
    icon: CalendarDays,
    exact: false,
  },
  {
    label: "Perfil",
    href: "/cms/dashboard/perfil",
    icon: UserCircle,
    exact: false,
  },
  { 
    label: "Tickets", 
    href: "/cms/dashboard/tickets", 
    icon: TicketIcon, 
    exact: false 
  },
];

type Props = {
  showLabels?: boolean;
};

export function SidebarNav({ showLabels = true }: Props) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Administração</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            const item = (
              <SidebarMenuButton asChild isActive={active} title={label}>
                <Link href={href} aria-current={active ? "page" : undefined}>
                  <Icon className={cn(["size-4"])} aria-hidden="true" />
                  {showLabels && (
                    <span
                      className={cn([
                        "group-data-[state=collapsed]/sidebar:hidden",
                      ])}
                    >
                      {label}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            );

            return (
              <SidebarMenuItem key={href}>
                {isCollapsed ? (
                  <Tooltip>
                    <TooltipTrigger render={<span className={cn(["block"])} />}>
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
