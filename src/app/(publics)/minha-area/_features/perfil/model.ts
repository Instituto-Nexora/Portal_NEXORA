import { z } from "zod";
import { perfilSchema, alterarSenhaSchema } from "./schema";

export type PerfilFormData = z.infer<typeof perfilSchema>;
export type AlterarSenhaFormData = z.infer<typeof alterarSenhaSchema>;