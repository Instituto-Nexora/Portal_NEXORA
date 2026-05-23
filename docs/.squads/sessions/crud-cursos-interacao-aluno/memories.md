# Memória: crud-cursos-interacao-aluno

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-05-15
Task: Minha Área — listar cursos onde o aluno está matriculado/cursando
Issue: —

## [frontend-001 · ana-arquitetura-fe] — 2026-05-15

[DECISÃO CRÍTICA] Padrão _features/ estabelecido:
- Toda nova feature com página significativa DEVE usar `src/_features/{nome-feature}/`
- Estrutura MVVM: view.tsx + viewModel.tsx + components/ + hooks/ + types/
- viewModel.tsx existe mesmo que vazio (preparado para interatividade futura)
- loading.tsx e error.tsx no diretório da rota App Router

## [frontend-001 · rodrigo-react] — 2026-05-15

Padrão de componente assíncrono:
- 4 estados obrigatórios: loading (skeleton), error (error boundary), empty (EmptyState), data (grid)
- Skeleton DEVE replicar o layout exato do componente de dados (mesmo grid, mesmas proporções)
- aria-label + role="progressbar" em barras de progresso
<!-- /RECENTES -->
