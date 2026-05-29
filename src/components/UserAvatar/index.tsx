import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({
  avatarUrl,
  displayName,
  initials,
  className,
}: {
  avatarUrl: string | null | undefined;
  displayName: string;
  initials: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-8", className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
      <AvatarFallback className={cn("bg-primary text-xs text-primary-foreground")}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}