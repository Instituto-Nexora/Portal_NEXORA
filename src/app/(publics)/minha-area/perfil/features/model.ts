import { z } from "zod";
import { alterarSenhaSchema, perfilSchema } from "./schema";
import { Tables } from "@/lib/supabase/types";

export type PerfilFormData = z.infer<typeof perfilSchema>;
export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

export type ActionState = {
  formId: "perfil" | "senha";
  success: boolean;
  message: string;
};

// Tipo para os dados iniciais do perfil, vindo do Server Component
export type PerfilInitialData = Tables["student_profiles"];