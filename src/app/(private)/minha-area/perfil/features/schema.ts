import { z } from "zod";

export const perfilSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Informe pelo menos 2 caracteres.")
    .max(80, "Use no máximo 80 caracteres."),
});

export const alterarSenhaSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
      .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
      .regex(/[0-9]/, "Inclua ao menos um número."),
    confirm_password: z.string().min(1, "Confirme a senha."),
    otp_code: z.string().optional(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "As senhas não conferem.",
  });
