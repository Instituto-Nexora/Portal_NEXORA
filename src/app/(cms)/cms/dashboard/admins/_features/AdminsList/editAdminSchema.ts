import { z } from "zod";

export const editAdminSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  role: z.enum(["admin", "content_creator", "professor"]),
});

export type EditAdminFormData = z.infer<typeof editAdminSchema>;
