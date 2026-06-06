# Memória: crud-aulas-admin

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## [frontend-001 · init] — 2026-06-06

Task: Implementar CRUD de aulas dentro de cursos no painel admin (CMS) — issue #20
Issue: #20 (GitHub — Instituto-Nexora/Portal_NEXORA)
Depende de: #18 (schema Supabase) e #19 (CRUD de cursos — concluído)

[DECISÃO CRÍTICA] Padrão RHF + Server Actions: NUNCA usar `action={formAction}` diretamente no form. Sempre `onSubmit={handleSubmit(onSubmit)}` onde `onSubmit` cria FormData manualmente e chama `startTransition(() => formAction(formData))`. Referência: `(auth)/login/_features/login/viewModel.tsx`.

[DECISÃO CRÍTICA] Zod v4: usar `z.number()` (não `z.coerce.number()`) + `{ valueAsNumber: true }` no register + `defaultValues` no useForm. `z.boolean()` sem `.default()`.
<!-- /RECENTES -->
