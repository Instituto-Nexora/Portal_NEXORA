import { Alert, AlertDescription } from "@/components/ui/alert";

type ProfileActionStatusProps = {
  status:
    | {
        success?: boolean;
        message?: string;
      }
    | null
    | undefined;
};

export function ProfileActionStatus({ status }: ProfileActionStatusProps) {
  if (!status?.message) return null;

  return (
    <Alert variant={status.success ? "default" : "destructive"}>
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  );
}
