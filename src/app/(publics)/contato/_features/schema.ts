import { z } from "zod";

export const contactSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.string().email("Insira um e-mail válido."),
  mensagem: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export type ContactFormType = z.infer<typeof contactSchema>;
