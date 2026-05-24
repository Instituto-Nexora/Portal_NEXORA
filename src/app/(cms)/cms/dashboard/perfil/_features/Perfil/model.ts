import type { FontSizeMode } from "@/hooks/useChangeFont";
import type { ThemeMode } from "@/hooks/useTheme";
import type { AdminRole } from "@/lib/supabase/types";

type PerfilInitialData = {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl: string | null;
  profileChangesRemaining: number;
  avatarChangesRemaining: number;
  passwordChangesRemaining: number;
  theme: ThemeMode;
  fontSize: FontSizeMode;
};

type PerfilActionState = {
  formId: "perfil" | "avatar" | "senha" | "conta";
  success: boolean;
  message: string;
  code?: "daily_limit_reached";
  resetAt?: string;
  errors?: Record<string, string[]>;
} | null;

export type { PerfilActionState, PerfilInitialData };
