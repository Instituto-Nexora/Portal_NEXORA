"use client";

import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { signOut } from "@/app/(cms)/cms/login/_features/login/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  user: SessionUser;
  compact?: boolean;
};

export function SidebarUserMenu({ user, compact = false }: Props) {
  const userAvatar = (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
      )}
    >
      {user.profile?.avatar_url ? (
        <Image
          src={user.profile.avatar_url}
          alt={user.profile.full_name}
          width={32}
          height={32}
          unoptimized
          className={cn("h-8 w-8 rounded-full object-cover")}
        />
      ) : (
        <User className={cn("h-4 w-4")} />
      )}
    </div>
  );

  const signOutButton = (
    <button
      type="submit"
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        compact && "justify-center px-0",
      )}
      aria-label={compact ? "Sair" : undefined}
    >
      <LogOut className={cn("h-4 w-4 shrink-0")} />
      {!compact && <span>Sair</span>}
    </button>
  );

  return (
    <div className={cn("flex flex-col gap-2 px-2")}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2",
          compact && "justify-center px-0",
        )}
      >
        {compact ? (
          <Tooltip>
            <TooltipTrigger render={<span className={cn("block")} />}>
              {userAvatar}
            </TooltipTrigger>
            <TooltipContent side="right">
              {user.profile?.full_name ?? user.email}
            </TooltipContent>
          </Tooltip>
        ) : (
          userAvatar
        )}
        {!compact && (
          <div className={cn("min-w-0 flex-1")}>
            <p className={cn("truncate text-sm font-medium")}>
              {user.profile?.full_name ?? "Administrador"}
            </p>
            <p className={cn("truncate text-xs text-muted-foreground")}>
              {user.email}
            </p>
          </div>
        )}
      </div>

      <form action={signOut}>
        {compact ? (
          <Tooltip>
            <TooltipTrigger render={<span className={cn("block")} />}>
              {signOutButton}
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        ) : (
          signOutButton
        )}
      </form>
    </div>
  );
}
