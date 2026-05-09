import { z } from "zod";
import { perfilSchema, alterarSenhaSchema } from "./schema";

export type PerfilFormData = z.infer<typeof perfilSchema>;
export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;

export type StudentProfile = {
  full_name: string;
  email: string;
  created_at: string;
};

export type ActionState = {
  success: boolean;
  message: string;
};
