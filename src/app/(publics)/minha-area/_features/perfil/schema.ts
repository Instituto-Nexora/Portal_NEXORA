import { z } from "zod";

export const perfilSchema = z.object({
  full_name: z.string().min(2, "Nome obrigatório"),
});

export const alterarSenhaSchema = z.object({
  current_password: z.string().min(1, "A senha atual é obrigatória"),
  new_password: z.string().min(6, "Mínimo 6 caracteres"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Senhas não coincidem",
  path: ["confirm_password"],
});