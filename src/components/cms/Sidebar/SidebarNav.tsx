"use client";

import { BookOpen, FileText, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/cms/dashboard", icon: LayoutDashboard },
  { label: "Conteúdos", href: "/cms/contents", icon: FileText },
  { label: "Cursos", href: "/cms/courses", icon: BookOpen },
  { label: "Usuários", href: "/cms/users", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1 px-2")}>
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
