import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/getInitials";

type UserAvatarProps = {
  avatarUrl: string | null | undefined;
  displayName: string;
  initials?: string;
  className?: string;
};

export function UserAvatar({
  avatarUrl,
  displayName,
  initials,
  className,
}: UserAvatarProps) {
  const fallbackInitials = initials || getInitials(displayName, "NX");

  return (
    <Avatar
      className={cn([
        "size-8 border-2 border-background bg-muted shadow-sm ring-1 ring-border",
        className,
      ])}
    >
      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
      <AvatarFallback
        className={cn([
          "bg-gradient-to-br from-primary to-teal-700 text-xs font-bold text-primary-foreground",
        ])}
      >
        {fallbackInitials}
      </AvatarFallback>
    </Avatar>
  );
}
