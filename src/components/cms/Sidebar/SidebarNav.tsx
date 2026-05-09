"use client";

import {
  BookOpen,
  CalendarDays,
  FileText,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
];

type Props = {
  showLabels?: boolean;
};

export function SidebarNav({ showLabels = true }: Props) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1 px-2")}>
      {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const link = (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              !showLabels && "justify-center px-0",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            aria-label={showLabels ? undefined : label}
          >
            <Icon className={cn("h-4 w-4 shrink-0")} />
            {showLabels && <span>{label}</span>}
          </Link>
        );

        if (showLabels) return link;

        return (
          <Tooltip key={href}>
            <TooltipTrigger render={<span className={cn("block")} />}>
              {link}
            </TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
