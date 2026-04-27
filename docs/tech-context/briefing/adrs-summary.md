# Sumário de ADRs — Portal NEXORA

> 7 ADRs encontradas em `docs/tech/adr/`. Todas com status: **Accepted**.

---

## Infraestrutura e Stack

| ADR | Título | Decisão Resumida |
|---|---|---|
| [001](../../tech/adr/001-app-router.md) | Next.js App Router | Usar App Router exclusivamente. Nunca Pages Router. |
| [002](../../tech/adr/002-supabase-baas.md) | Supabase como BaaS | Auth + PostgreSQL via Supabase. Service Role Key apenas no servidor. |
| [003](../../tech/adr/003-tailwind-v4.md) | Tailwind CSS v4 | Config via CSS (não tailwind.config.js). Plugin v4 exclusivo. |

## Arquitetura de Código

| ADR | Título | Decisão Resumida |
|---|---|---|
| [004](../../tech/adr/004-mvvm-page-architecture.md) | MVVM Page Architecture | page.tsx = Server Component. Lógica no viewModel.tsx. UI no view.tsx. Formulários com RHF + Zod. |
| [005](../../tech/adr/005-type-only-convention.md) | Type-Only Convention | Nunca `interface`. Sempre `type`. Tipos derivados de Zod via `z.infer`. |
| [006](../../tech/adr/006-utils-reusable-functions.md) | Utils — Funções Reutilizáveis | Funções puras em `src/utils/`. Nunca duplicar. Rule of Three. |
| [007](../../tech/adr/007-cn-classname-utility.md) | cn() para className | `cn()` obrigatório em todo className. Importar de `@/lib/utils`. |
