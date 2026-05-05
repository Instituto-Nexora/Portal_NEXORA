import { z } from 'zod'

export const novoAdminSchema = z
  .object({
    full_name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirm_password: z.string(),
    role: z.enum(['admin', 'content_creator', 'professor']),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

export type NovoAdminFormData = z.infer<typeof novoAdminSchema>
