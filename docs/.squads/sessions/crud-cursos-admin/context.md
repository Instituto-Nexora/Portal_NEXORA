# Contexto: crud-cursos-admin

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.

## O que é
Implementação do CRUD de cursos no painel administrativo (CMS) do Portal NEXORA — issue #19.
Administradores podem listar, criar, editar e remover cursos via `/cms/dashboard/cursos`.

## Por que existe
O módulo de cursos é o core da plataforma educacional. Sem o CRUD admin, não é possível cadastrar conteúdo para os alunos. Esta issue é pré-requisito para as issues #20 (CRUD de aulas), #21 (player de vídeo) e #25 (detalhe do curso).

## Decisões tomadas
- Padrão MVVM obrigatório (ADR-004): page.tsx Server Component, view.tsx + viewModel.tsx Client
- Formulários com React Hook Form + Zod (ADR-004)
- Server Actions com `createAdminClient()` para contornar RLS
- Shadcn/UI para todos os componentes de form (ADR-009)
- Tipos derivados de Zod via `z.infer` (ADR-005)
- `cn()` obrigatório em todo className (ADR-007)

## O que não fazer
- Não usar `interface` — sempre `type`
- Não usar `useState` para campos de formulário
- Não usar `SUPABASE_SERVICE_ROLE_KEY` no cliente
- Não adicionar `"use client"` em page.tsx
