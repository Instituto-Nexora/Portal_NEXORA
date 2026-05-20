import type { FontSizeMode } from "@/hooks/useChangeFont";
import type { ThemeMode } from "@/hooks/useTheme";
import type { AdminRole } from "@/lib/supabase/types";

type PerfilInitialData = {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl: string | null;
  nextProfileChangeAt: string | null;
  nextAvatarChangeAt: string | null;
  theme: ThemeMode;
  fontSize: FontSizeMode;
};

type PerfilActionState = {
  formId: "perfil" | "avatar" | "senha" | "conta";
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
} | null;

export type { PerfilActionState, PerfilInitialData };
