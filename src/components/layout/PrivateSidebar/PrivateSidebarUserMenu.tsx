"use client";

import {
  ChevronsUpDown,
  LogOut,
  MoreHorizontal,
  Settings,
  TicketIcon,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";

type Props = {
  user: SessionUser;
};

export function PrivateSidebarUserMenu({ user }: Props) {
  const { isMobile, state } = useSidebar();
  const displayName = user.profile?.full_name ?? "Aluno";
  const avatarUrl = user.profile?.avatar_url;
  const initials = getInitials(displayName, "AL");
  const isCollapsed = state === "collapsed";

  if (isMobile) {
    return (
      <div className={cn("space-y-2 px-2")}>
        <div
          className={cn("flex items-center gap-3 rounded-md px-2 py-2 text-sm")}
        >
          <UserAvatar
            avatarUrl={avatarUrl}
            displayName={displayName}
            initials={initials}
          />
          <span className={cn("min-w-0 flex-1 text-left")}>
            <span className={cn("block truncate font-medium")}>
              {displayName}
            </span>
            <span
              className={cn("block truncate text-xs text-muted-foreground")}
            >
              {user.email}
            </span>
          </span>
        </div>
        <Button
          nativeButton={false}
          variant="ghost"
          className={cn("w-full justify-start gap-2")}
          render={<Link href="/minha-area/perfil" />}
        >
          <UserCircle className={cn("size-4")} />
          Meu perfil
        </Button>
        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <LogOut className={cn("size-4")} />
            Sair
          </Button>
        </form>
      </div>
    );
  }

  const trigger = (
    <DropdownMenuTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "relative h-auto w-full cursor-pointer justify-start gap-2 px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[state=collapsed]/sidebar:size-9 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0",
          )}
        />
      }
    >
      <UserAvatar
        avatarUrl={avatarUrl}
        displayName={displayName}
        initials={initials}
      />
      <span
        className={cn(
          "min-w-0 flex-1 text-left group-data-[state=collapsed]/sidebar:hidden",
        )}
      >
        <span className={cn("block truncate text-sm font-medium")}>
          {displayName}
        </span>
        <span className={cn("block truncate text-xs text-muted-foreground")}>
          {user.email}
        </span>
      </span>
      <ChevronsUpDown
        className={cn(
          "ml-auto size-4 text-muted-foreground group-data-[state=collapsed]/sidebar:hidden",
        )}
        aria-hidden="true"
      />
      <MoreHorizontal
        className={cn(
          "absolute right-0 bottom-0 hidden size-3 rounded-full bg-background text-primary group-data-[state=collapsed]/sidebar:block",
        )}
        aria-hidden="true"
      />
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenu>
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger render={<span className={cn("block")} />}>
            {trigger}
          </TooltipTrigger>
          <TooltipContent side="right">Abrir menu do usuário</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent side="right" align="end" className={cn("w-64")}>
        <DropdownMenuLabel>
          <div className={cn("flex items-center gap-2")}>
            <UserAvatar
              avatarUrl={avatarUrl}
              displayName={displayName}
              initials={initials}
              className="size-9"
            />
            <div className={cn("min-w-0")}>
              <p className={cn("truncate")}>{displayName}</p>
              <p
                className={cn(
                  "truncate text-xs font-normal text-muted-foreground",
                )}
              >
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem closeOnClick={false}>
          <Link href="/minha-area" className={cn("flex w-full items-center gap-2")}>
            <LayoutDashboard className={cn("size-4")} />
            Minha Área
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false}>
          <Link href="/minha-area/perfil" className={cn("flex w-full items-center gap-2")}>
            <UserCircle className={cn("size-4")} />
            Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false}>
          <Link href="/minha-area/tickets" className={cn("flex w-full items-center gap-2")}>
            <TicketIcon className={cn("size-4")} />
            Meus Tickets
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem closeOnClick={false}>
          <Link href="/minha-area/perfil#preferencias" className={cn("flex w-full items-center gap-2")}>
            <Settings className={cn("size-4")} />
            Preferências
          </Link>
        </DropdownMenuItem>

 
        <form action={signOut}>
          <DropdownMenuItem variant="destructive" closeOnClick={false}>
            <button
              type="submit"
              className={cn("flex w-full items-center gap-2 text-left")}
            >
              <LogOut className={cn("size-4")} />
              Sair
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
