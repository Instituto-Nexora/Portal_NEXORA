import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { PasswordStrength } from "@/utils/getPasswordStrength";

type PasswordStrengthMeterProps = {
  passwordStrength: PasswordStrength;
};

export function PasswordStrengthMeter({
  passwordStrength,
}: PasswordStrengthMeterProps) {
  return (
    <div className={cn(["min-w-0 space-y-2"])}>
      <div className={cn(["flex items-center justify-between gap-3"])}>
        <Label>Força da senha</Label>
        <span
          className={cn([
            "text-xs text-muted-foreground",
            passwordStrength.textColor,
          ])}
        >
          {passwordStrength.label}
        </span>
      </div>
      <Progress
        value={passwordStrength.score}
        className={cn(["h-1.5 bg-slate-100"])}
        indicatorClassName={passwordStrength.barColor}
      />
    </div>
  );
}
