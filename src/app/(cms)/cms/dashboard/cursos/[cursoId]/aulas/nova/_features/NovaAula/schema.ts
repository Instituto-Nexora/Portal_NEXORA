import { z } from "zod";

export const aulaSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  video_url: z.string().url("URL inválida").optional().or(z.literal("")),
  material_url: z.string().url("URL inválida").optional().or(z.literal("")),
  is_published: z.boolean(),
});

export type AulaFormData = z.infer<typeof aulaSchema>;
