import { cn } from '@/lib/utils'

export function DashboardView() {
  return (
    <div className={cn('space-y-6')}>
      <div>
        <h2 className={cn('text-2xl font-bold tracking-tight')}>Dashboard</h2>
        <p className={cn('text-muted-foreground')}>
          Bem-vindo ao painel de administração do Portal Nexora.
        </p>
      </div>

      <div className={cn('grid gap-4 md:grid-cols-3')}>
        {(['Cursos', 'Conteúdos', 'Usuários'] as const).map((label) => (
          <div
            key={label}
            className={cn(
              'rounded-lg border bg-card p-6 text-card-foreground shadow-sm'
            )}
          >
            <p className={cn('text-sm font-medium text-muted-foreground')}>
              {label}
            </p>
            <p className={cn('mt-2 text-3xl font-bold')}>—</p>
          </div>
        ))}
      </div>
    </div>
  )
}
