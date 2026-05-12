'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ActionState } from '@/lib/supabase/types'
import { novoAdminSchema } from './schema'

export async function criarAdmin(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
    role: formData.get('role'),
  }

  const parsed = novoAdminSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten((issue) => issue.message).fieldErrors as Record<
        string,
        string[]
      >,
    }
  }

  const adminClient = createAdminClient()

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return { message: authError?.message ?? 'Erro ao criar conta.' }
  }

  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      full_name: parsed.data.full_name,
      role: parsed.data.role,
    })

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authData.user.id)
    return { message: 'Erro ao criar administrador. Tente novamente.' }
  }

  redirect('/cms/dashboard')
}
