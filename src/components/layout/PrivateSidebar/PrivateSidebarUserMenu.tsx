"use client";

import { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  user: SessionUser;
};

export function PrivateSidebarUserMenu({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative px-4")} ref={menuRef}>
      {/* Dropdown Menu - Aparece ao lado direito */}
      {isOpen && (
        <div className="absolute left-full bottom-0 ml-2 w-48 bg-background rounded-md shadow-lg border border-border overflow-hidden z-50">
          <div className="py-1 flex flex-col">
            <Link
              href="/perfil"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 transition-colors"
            >
              <User className="size-4" />
              Meu Perfil
            </Link>
            <div className="h-px bg-border my-1"></div>
            <form action={signOut} className="w-full">
              <button
                type="submit"
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none",
          isOpen && "bg-accent text-accent-foreground"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {user.profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profile.avatar_url}
              alt={user.profile.full_name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <UserCircle className="size-6" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium">
            {user.profile?.full_name || "Usuário"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>
        </div>
        <ChevronRight className={cn("size-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
    </div>
  );
}
