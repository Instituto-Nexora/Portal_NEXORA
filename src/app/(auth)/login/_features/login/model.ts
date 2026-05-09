import { z } from "zod";
import { loginSchema } from "../login/schema";

export type LoginFormData = z.infer<typeof loginSchema>;