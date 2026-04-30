'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from './schema'
import type { ActionState } from '@/lib/supabase/types'

export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  }

  const parsed = registerSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (authError || !authData.user) {
    return { message: authError?.message ?? 'Erro ao criar conta.' }
  }

  const { error: profileError } = await supabase
    .from('admin_profiles')
    .insert({
      user_id: authData.user.id,
      full_name: parsed.data.full_name,
      role: 'content_creator',
    })

  if (profileError) {
    return { message: 'Conta criada, mas erro ao salvar perfil.' }
  }

  redirect('/cms/dashboard')
}
