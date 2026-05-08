import { z } from "zod";

export const cursoSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().optional(),
  price_cents: z.string().optional(),
  is_published: z.boolean(),
});

export type CursoFormData = z.infer<typeof cursoSchema>;
