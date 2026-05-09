# Memória: crud-aulas-admin

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-05-09
Task: CRUD de aulas dentro de cursos no CMS Admin
Issue: local — Portal Nexora

## [frontend-001 · usuario] — 2026-05-09
Ajuste no schema da tabela lessons: course_id (em vez de curso_id), removeu description e created_by/updated_at, adicionou material_url e duration_seconds.
## Padrão aprovado — 2026-05-09
MVVM Page Architecture seguido fielmente: page.tsx Server Component, view.tsx sem lógica, viewModel.tsx sem JSX, schema.ts com Zod, actions.ts com Server Actions.
Schema de aula compartilhado entre criação e edição via re-export.
<!-- /RECENTES -->
