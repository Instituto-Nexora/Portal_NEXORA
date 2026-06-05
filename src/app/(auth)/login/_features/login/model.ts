import type { z } from "zod";
import type { loginSchema } from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;
