import { z } from "zod"

export const aulaSchema = z.object({
  title: z.string().min(3, "Título obrigatório (mínimo 3 caracteres)"),
  video_url: z.string().url("URL de vídeo inválida").optional().or(z.literal("")),
  position: z.number().int().min(0, "Posição inválida"),
  duration_seconds: z.number().int().min(0, "Duração inválida").optional().or(z.nan().transform(() => undefined)),
  is_published: z.boolean(),
})

export type AulaFormData = z.infer<typeof aulaSchema>
