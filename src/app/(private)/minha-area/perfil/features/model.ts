import type { z } from "zod";
import type {
  ActionState as BaseActionState,
  StudentProfile,
} from "@/lib/supabase/types";
import type { alterarSenhaSchema, perfilSchema } from "./schema";

export type PerfilFormData = z.infer<typeof perfilSchema>;
export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

export type ActionState = BaseActionState & {
  formId: "perfil" | "senha" | "avatar";
};

export type PerfilInitialData = StudentProfile & { avatar_url?: string | null };
