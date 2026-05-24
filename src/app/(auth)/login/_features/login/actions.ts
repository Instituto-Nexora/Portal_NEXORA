"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/supabase/types";
import { loginSchema } from "./schema";

export async function login(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const parsed = loginSchema.safeParse({ email, password });

  if (!parsed.success) {
    return {
      success: false,
      message: "Dados inválidos. Verifique as informações preenchidas.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: "E-mail ou senha incorretos. Tente novamente.",
      };
    }
  } catch (_error) {
    return {
      success: false,
      message: "Ocorreu um erro inesperado ao tentar entrar.",
    };
  }

  redirect("/minha-area");
}
