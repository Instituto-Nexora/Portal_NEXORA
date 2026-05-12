import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  mobileNav?: React.ReactNode;
};

export function TopBar({ title, mobileNav }: Props) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3 sm:px-6",
      )}
    >
      {mobileNav}
      {title && <h1 className={cn("text-base font-semibold")}>{title}</h1>}
    </header>
  );
}
