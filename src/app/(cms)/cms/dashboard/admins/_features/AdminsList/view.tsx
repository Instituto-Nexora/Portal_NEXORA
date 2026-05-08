import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AdminProfile, AdminRole } from '@/lib/supabase/types'

type Props = {
  admins: AdminProfile[]
}

const ROLE_LABEL: Record<AdminRole, string> = {
  admin: 'Admin',
  content_creator: 'Content Creator',
  professor: 'Professor',
}

const ROLE_VARIANT: Record<AdminRole, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  content_creator: 'secondary',
  professor: 'outline',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function AdminsListView({ admins }: Props) {
  return (
    <div className={cn(['space-y-6'])}>
      <div className={cn(['flex items-center justify-between'])}>
        <div>
          <h2 className={cn(['text-2xl font-bold tracking-tight'])}>Administradores</h2>
          <p className={cn(['text-sm text-muted-foreground'])}>
            Gerencie os usuários com acesso ao CMS.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/cms/dashboard/admins/novo" />}>
          Criar administrador
        </Button>
      </div>

      {admins.length === 0 ? (
        <div
          className={cn([
            'rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground',
          ])}
        >
          Nenhum administrador cadastrado ainda.
        </div>
      ) : (
        <div className={cn(['rounded-lg border overflow-hidden'])}>
          <table className={cn(['w-full text-sm'])}>
            <thead>
              <tr className={cn(['border-b bg-muted/50'])}>
                <th
                  className={cn(['px-4 py-3 text-left font-medium text-muted-foreground'])}
                >
                  Nome
                </th>
                <th
                  className={cn(['px-4 py-3 text-left font-medium text-muted-foreground'])}
                >
                  Permissão
                </th>
                <th
                  className={cn([
                    'px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell',
                  ])}
                >
                  Desde
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={cn(['border-b last:border-0', { 'bg-muted/20': index % 2 !== 0 }])}
                >
                  <td className={cn(['px-4 py-3 font-medium'])}>{admin.full_name}</td>
                  <td className={cn(['px-4 py-3'])}>
                    <Badge variant={ROLE_VARIANT[admin.role]}>
                      {ROLE_LABEL[admin.role]}
                    </Badge>
                  </td>
                  <td
                    className={cn([
                      'px-4 py-3 text-muted-foreground hidden sm:table-cell',
                    ])}
                  >
                    {formatDate(admin.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
