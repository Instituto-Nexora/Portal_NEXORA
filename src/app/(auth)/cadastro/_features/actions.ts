"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/supabase/types";
import { cadastroSchema } from "./schema";

export async function cadastrar(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const data = Object.fromEntries(formData.entries());

  const validatedFields = cadastroSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, full_name } = validatedFields.data;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-area`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (signUpData.session) {
    redirect("/minha-area");
  }

  return {
    success: true,
    message: "Cadastro realizado! Verifique seu e-mail para confirmar a conta.",
  };
}
