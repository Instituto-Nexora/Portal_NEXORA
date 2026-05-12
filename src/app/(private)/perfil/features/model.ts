import { z } from "zod";
import { alterarSenhaSchema, perfilSchema } from "./schema";
import { StudentProfile, ActionState as BaseActionState } from "@/lib/supabase/types";

export type PerfilFormData = z.infer<typeof perfilSchema>;
export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

export type ActionState = BaseActionState & {
  formId: "perfil" | "senha";
};

// Tipo para os dados iniciais do perfil, vindo do Server Component
export type PerfilInitialData = StudentProfile;