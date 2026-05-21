import { z } from "zod";

export const novoTicketSchema = z.object({
  topico: z.enum(["aula", "cadastro", "curso", "eventos", "reclamacao"]),
  mensagem: z.string().min(10, "Por favor, forneça mais detalhes (mínimo de 10 caracteres).").max(2000, "Sua mensagem é muito longa."),
});

export type NovoTicketFormValues = z.infer<typeof novoTicketSchema>;