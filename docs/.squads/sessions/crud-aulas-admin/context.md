# Contexto: crud-aulas-admin

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.

## O que é

CRUD completo de aulas dentro de cursos no painel CMS admin. Rota base: `/cms/dashboard/cursos/[cursoId]` — listagem, criação e edição de aulas associadas a um curso específico.

## Por que existe

Aulas são a unidade de conteúdo dentro de cursos. Sem CRUD de aulas no CMS, administradores não conseguem popular os cursos com vídeos/materiais. Depende do CRUD de cursos (issue #19) que já foi implementado.

## Decisões tomadas

- Padrão MVVM obrigatório (ADR-004): `page.tsx` Server Component, `view.tsx` e `viewModel.tsx` "use client"
- Schema de aulas: `lessons(id, course_id, title, video_url, position, duration_seconds, is_published, created_at)`
- `createAdminClient()` em todas as Server Actions
- Schema compartilhado: `aulaSchema` em `NovaAula/schema.ts`, importado por `EditarAula` via alias `@/`
- RHF + Server Actions: `startTransition(() => formAction(formData))` — jamais `action={formAction}` diretamente

## O que não fazer

- Nunca `"use client"` em `page.tsx`
- Nunca `useState` para campos de formulário
- Nunca `z.coerce.number()` com RHF resolver (incompatível com Zod v4) — usar `z.number()` + `{ valueAsNumber: true }`
- Nunca `z.boolean().default(false)` com RHF (causa type mismatch) — usar `z.boolean()` + `defaultValues`
- Não duplicar `aulaSchema` — importar de `NovaAula/schema.ts`
