'use client';

import { useActionState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { cadastroSchema, type CadastroSchema } from './schema';
import { ActionState } from '@/lib/supabase/types';
import { cadastrar } from './actions';

export const useCadastroViewModel = () => {
  const initialState: ActionState = { success: false, message: undefined };
  const [state, formAction, isPending] = useActionState(cadastrar, initialState);

  const form = useForm<CadastroSchema>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  return {
    form,
    state,
    formAction,
    isPending,
  };
};