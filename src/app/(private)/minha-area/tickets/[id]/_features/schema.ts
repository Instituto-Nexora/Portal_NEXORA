import { z } from "zod";

export const novaMensagemSchema = z.object({
  mensagem: z.string()
    .trim()
    .min(1, "A mensagem não pode estar vazia.")
    .max(2000, "Sua mensagem é muito longa. Limite de 2000 caracteres."),
});

export type NovaMensagemFormValues = z.infer<typeof novaMensagemSchema>;