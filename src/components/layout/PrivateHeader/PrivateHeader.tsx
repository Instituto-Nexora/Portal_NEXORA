"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type Props = {
  user: SessionUser;
};

export function PrivateHeader({ user: _ }: Props) {
  const { theme, setTheme } = useTheme();

  function handleThemeToggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6",
      )}
    >
      <SidebarTrigger />

      <div className={cn("ml-auto")}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleThemeToggle}
          aria-label={
            theme === "dark"
              ? "Mudar para tema claro"
              : "Mudar para tema escuro"
          }
        >
          {theme === "dark" ? (
            <Sun className={cn("size-5")} />
          ) : (
            <Moon className={cn("size-5")} />
          )}
        </Button>
      </div>
    </header>
  );
}
