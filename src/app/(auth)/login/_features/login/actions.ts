"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "./schema";
import type { ActionState } from "./model";
import { createClient } from "@/lib/supabase/server";

export async function login( _prev: ActionState | null, formData: FormData ): Promise<ActionState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // Validar com Zod no servidor
  const parsed = loginSchema.safeParse({ email, password });

  if (!parsed.success) {
    return { success: false, message: "Dados inválidos. Verifique as informações preenchidas." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { success: false, message: "E-mail ou senha incorretos. Tente novamente." };
    }
  } catch (error) {
    return { success: false, message: "Ocorreu um erro inesperado ao tentar entrar." };
  }

  // Sucesso com redirecionamento para a área logada
  redirect("/minha-area");
}