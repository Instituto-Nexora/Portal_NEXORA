"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SessionUser } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";

type Props = {
  user: SessionUser;
};

export function CMSMobileSidebar({ user }: Props) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className={cn("lg:hidden")}
          />
        }
      >
        <PanelLeft className={cn("size-5")} aria-hidden="true" />
        <span className={cn("sr-only")}>Abrir menu do CMS</span>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn("w-[min(20rem,calc(100vw-2rem))] max-w-none gap-0 p-0")}
      >
        <SheetTitle className={cn("sr-only")}>Menu do CMS</SheetTitle>
        <SheetDescription className={cn("sr-only")}>
          Navegação principal da área administrativa.
        </SheetDescription>
        <Sidebar
          user={user}
          variant="full"
          className={cn("w-full border-r-0")}
        />
      </SheetContent>
    </Sheet>
  );
}
