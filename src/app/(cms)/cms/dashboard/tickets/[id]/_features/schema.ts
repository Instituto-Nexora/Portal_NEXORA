import { z } from "zod";

export const novaMensagemAdminSchema = z.object({
  mensagem: z.string()
    .trim()
    .min(1, "A mensagem não pode estar vazia.")
    .max(5000, "Sua mensagem é muito longa. Limite de 5000 caracteres."),
});

export type NovaMensagemAdminFormValues = z.infer<typeof novaMensagemAdminSchema>;