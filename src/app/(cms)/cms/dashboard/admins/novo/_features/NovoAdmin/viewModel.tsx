'use client'

import { useActionState } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { criarAdmin } from './actions'
import { novoAdminSchema, type NovoAdminFormData } from './schema'
import type { ActionState } from '@/lib/supabase/types'

type NovoAdminViewModel = {
  form: UseFormReturn<NovoAdminFormData>
  formAction: (payload: FormData) => void
  isPending: boolean
  state: ActionState
  handleCancel: () => void
}

export function useNovoAdminViewModel(): NovoAdminViewModel {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    criarAdmin,
    undefined
  )

  const form = useForm<NovoAdminFormData>({
    resolver: zodResolver(novoAdminSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      role: 'content_creator',
    },
  })

  function handleCancel() {
    router.back()
  }

  return { form, formAction, isPending, state, handleCancel }
}
