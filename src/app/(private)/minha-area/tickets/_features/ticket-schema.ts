import { z } from "zod";

export const ticketTopicoValues = [
  "aula",
  "cadastro",
  "curso",
  "eventos",
  "reclamacao",
] as const;

export const ticketTopicoLabels: Record<
  (typeof ticketTopicoValues)[number],
  string
> = {
  aula: "Dúvida sobre Aula / Conteúdo",
  cadastro: "Problema com Cadastro / Acesso",
  curso: "Dúvida sobre Compras / Cursos",
  eventos: "Informações sobre Eventos",
  reclamacao: "Reclamação",
};

export const ticketFormSchema = z.object({
  topico: z.enum(ticketTopicoValues, {
    error: "Selecione um assunto válido.",
  }),
  mensagem: z
    .string()
    .min(10, "Por favor, forneça mais detalhes (mínimo de 10 caracteres).")
    .max(2000, "Sua mensagem é muito longa."),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;
