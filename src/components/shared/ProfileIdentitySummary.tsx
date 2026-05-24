import { cn } from "@/lib/utils";

type ProfileIdentitySummaryProps = {
  fullName: string | null | undefined;
  email: string | null | undefined;
};

export function ProfileIdentitySummary({
  fullName,
  email,
}: ProfileIdentitySummaryProps) {
  return (
    <div className={cn(["space-y-1 text-center"])}>
      <p className={cn(["text-sm font-medium"])}>{fullName}</p>
      <p className={cn(["text-xs text-muted-foreground"])}>{email}</p>
    </div>
  );
}
