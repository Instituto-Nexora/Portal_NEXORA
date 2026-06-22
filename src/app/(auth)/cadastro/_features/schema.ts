import { z } from "zod";

export const cadastroSchema = z
  .object({
    full_name: z.string().min(2, "Nome obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "As senhas não coincidem",
    path: ["confirm_password"],
  });

export type CadastroSchema = z.infer<typeof cadastroSchema>;
