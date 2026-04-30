'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from './schema'
import type { ActionState } from '@/lib/supabase/types'

export async function signIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const parsed = loginSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { message: 'Credenciais inválidas. Verifique e-mail e senha.' }
  }

  redirect('/cms/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/cms/login')
}
