import { z } from "zod"

export const cursoSchema = z.object({
  title: z.string().min(3, "Título obrigatório (mínimo 3 caracteres)"),
  description: z.string().optional(),
  thumbnail_url: z
    .string()
    .url("URL de thumbnail inválida")
    .optional()
    .or(z.literal("")),
  price_cents: z.number().int("Deve ser um valor inteiro").min(0, "Preço não pode ser negativo"),
  is_published: z.boolean(),
})

export type CursoFormData = z.infer<typeof cursoSchema>
