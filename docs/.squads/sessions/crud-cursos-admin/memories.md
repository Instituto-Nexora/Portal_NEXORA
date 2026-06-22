# Memória: crud-cursos-admin

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.

<!-- SUMMARY -->
## Resumo

Pipeline `feature-development` concluído. CRUD de cursos admin implementado em 3 rotas MVVM.

**Aprendizados críticos:**
- **Zod v4**: `z.coerce.number()` e `.default()` incompatíveis com RHF resolver — usar `z.number()` + `{ valueAsNumber: true }` + `defaultValues`
- **RHF + Server Actions**: NUNCA `action={formAction}` — sempre `onSubmit={handleSubmit(onSubmit)}` com FormData manual + `startTransition`
- **Next.js 16 params**: `params` é `Promise<{...}>` — deve ser `await`ed em async Server Components
- **Schema compartilhado**: `cursoSchema` em `NovoCurso/schema.ts`, importado por `EditarCurso` via `@/` alias
<!-- /SUMMARY -->

<!-- RECENTES -->
## [frontend-001 · init] — 2026-06-06

Task: Implementar CRUD de cursos no painel admin (CMS) — issue #19
Issue: #19 (GitHub — Instituto-Nexora/Portal_NEXORA)

## [frontend-001 · completed] — 2026-06-06

- Pipeline feature-development concluído (steps 01-07) — status: ✅ COMPLETED
- BLOCKER corrigido: forms bypassavam RHF validation (usar handleSubmit, não action={})
- 3 incompatibilidades Zod v4 encontradas e corrigidas
- ADR-FE-023 criado: padrão canônico RHF + Server Actions
- SidebarNav.tsx: href Cursos corrigido para `/cms/dashboard/cursos`
<!-- /RECENTES -->
