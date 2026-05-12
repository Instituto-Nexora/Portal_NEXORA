import { z } from "zod";
import { loginSchema } from "./schema";

export type LoginFormData = z.infer<typeof loginSchema>;