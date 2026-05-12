# Memória: fix-update-fluxo-criar-eventos

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
Task: Bug — evento criado no CMS não refletia em /eventos público
Issue: —

## [frontend-001 · ana-arquitetura-fe] — 2026-05-08

[DECISÃO CRÍTICA] Padrão aprovado — revalidação de cache após mutação de eventos:
- Toda Server Action que muta a tabela `events` DEVE chamar `revalidatePath('/eventos')` antes do `redirect`
- Para edição/exclusão: revalidar também `/eventos/${slug}` para invalidar página de detalhe
- Padrão: encadear `.select("slug").single()` no `.update()` para obter o slug sem query extra
- `excluirEvento`: buscar slug ANTES do delete para poder revalidar a página de detalhe
<!-- /RECENTES -->
