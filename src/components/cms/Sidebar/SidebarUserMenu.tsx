"use client";

import { LogOut, User } from "lucide-react";
import { signOut } from "@/app/(cms)/cms/login/_features/login/actions";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  user: SessionUser;
};

export function SidebarUserMenu({ user }: Props) {
  return (
    <div className={cn("flex flex-col gap-2 px-2")}>
      <div className={cn("flex items-center gap-3 rounded-md px-3 py-2")}>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
          )}
        >
          {user.profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profile.avatar_url}
              alt={user.profile.full_name}
              className={cn("h-8 w-8 rounded-full object-cover")}
            />
          ) : (
            <User className={cn("h-4 w-4")} />
          )}
        </div>
        <div className={cn("min-w-0 flex-1")}>
          <p className={cn("truncate text-sm font-medium")}>
            {user.profile?.full_name ?? "Administrador"}
          </p>
          <p className={cn("truncate text-xs text-muted-foreground")}>
            {user.email}
          </p>
        </div>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0")} />
          Sair
        </button>
      </form>
    </div>
  );
}
