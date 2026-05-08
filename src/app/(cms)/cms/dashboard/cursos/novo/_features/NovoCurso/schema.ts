import { z } from "zod";

export const cursoSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  price_cents: z.string().optional(),
  is_published: z.boolean(),
});

export type CursoFormData = z.infer<typeof cursoSchema>;
