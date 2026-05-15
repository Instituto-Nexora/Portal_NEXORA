import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  mobileNav?: React.ReactNode;
};

export function TopBar({ title, mobileNav }: Props) {
  return (
    <header
      className={cn([
        "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6",
      ])}
    >
      {mobileNav ?? <SidebarTrigger />}
      {title && <h1 className={cn(["text-base font-semibold"])}>{title}</h1>}
      <div className={cn(["ml-auto text-xs text-muted-foreground"])}>
        NEXORA CMS
      </div>
    </header>
  );
}
