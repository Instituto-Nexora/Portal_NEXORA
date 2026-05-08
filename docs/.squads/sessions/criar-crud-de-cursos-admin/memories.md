# Memória: criar-crud-de-cursos-admin

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-05-08
Task: CRUD completo de cursos no CMS Admin — listagem, criação, edição e exclusão na tabela de cursos do banco de dados
Issue: —

## [frontend-001 · ana-arquitetura-fe] — 2026-05-08

[DECISÃO CRÍTICA] Padrões aprovados — CRUD de cursos:
- Schema Zod definido uma única vez em `NovoCurso/schema.ts` e re-exportado por `EditarCurso/schema.ts` — fonte única de verdade (ADR-001)
- Slug gerado server-side com `slugify()` — nunca enviado pelo cliente (ADR-002)
- `revalidatePath("/cms/dashboard/cursos")` é o padrão para revalidação de listagem após mutação de cursos
- Para edição/exclusão de curso: obter slug via `.select("slug").single()` e revalidar também `/cursos/${slug}` (página pública)
- `duration_hours` como `z.string().optional()` no schema — conversão manual `Number()` no server action (sem `.transform()` para compatibilidade RHF)
- `.url()` do Zod v4 depreciado — usar `z.string().optional()` + validação HTML5 `type="url"`
- Delete sem `<form>`: `useTransition` + chamada direta à Server Action (mesmo padrão de DeleteEventoDialog)
<!-- /RECENTES -->
