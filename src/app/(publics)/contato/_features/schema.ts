import { z } from "zod";

export const contactSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório para sabermos quem você é."),
  email: z.string().email("Por favor, insira um e-mail válido."),
  mensagem: z.string().min(10, "Escreva um pouco mais para podermos te ajudar melhor!"),
});

export type ContactFormType = z.infer<typeof contactSchema>;
