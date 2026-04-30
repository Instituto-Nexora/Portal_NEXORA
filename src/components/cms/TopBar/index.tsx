import { cn } from "@/lib/utils";

type Props = {
  title?: string;
};

export function TopBar({ title }: Props) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center border-b bg-background px-6",
      )}
    >
      {title && <h1 className={cn("text-base font-semibold")}>{title}</h1>}
    </header>
  );
}
