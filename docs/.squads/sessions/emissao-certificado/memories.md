# Memória: emissao-certificado

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-06-16
Task: Issue #23 — Implementar emissão de certificado (PDF)
Issue: #23

## [frontend-001 · usuario] — 2026-06-16
[DECISÃO CRÍTICA] Botão "Baixar Certificado" fica na sidebar do Player (`/minha-area/cursos/[cursoId]/aulas/[aulaId]`), não em uma página de detalhe de curso nova. `CursoCard.tsx` já aponta para `/api/certificados/[courseId]`.
<!-- /RECENTES -->
