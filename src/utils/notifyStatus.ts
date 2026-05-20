import { toast } from "sonner";

type ActionStatus = { success?: boolean; message?: string } | null | undefined;

export const notifyStatus = (status: ActionStatus): void => {
  if (!status?.message) return;
  if (status.success) {
    toast.success(status.message);
  } else {
    toast.error(status.message);
  }
};
