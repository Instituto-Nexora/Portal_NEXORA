import { z } from "zod";

export const eventoSchema = z
  .object({
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
    description: z
      .string()
      .min(10, "Descrição deve ter no mínimo 10 caracteres"),
    long_description: z.string().optional(),
    type: z.enum(["ao_vivo", "gravado"]),
    status: z.enum(["draft", "published", "archived"]),
    scheduled_at: z.string().optional(),
    duration_minutes: z.string().optional(),
    youtube_url: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "ao_vivo") {
        return !!data.scheduled_at;
      }
      return true;
    },
    {
      message: "Data e hora são obrigatórias para eventos ao vivo",
      path: ["scheduled_at"],
    },
  );

export type EventoFormData = z.infer<typeof eventoSchema>;
