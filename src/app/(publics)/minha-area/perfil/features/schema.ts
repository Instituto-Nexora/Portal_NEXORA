import { z } from "zod";

export const perfilSchema = z.object({
  full_name: z.string().min(2, "Nome obrigatório"),
});

export const alterarSenhaSchema = z.object({
  new_password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
});