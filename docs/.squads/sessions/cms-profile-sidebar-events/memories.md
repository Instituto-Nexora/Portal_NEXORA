# Memória: cms-profile-sidebar-events

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-05-12
Task: Realizar issues #80, #68 e #70; ajustar responsividade do formulário de edição de evento; trocar sidebar do CMS para Sidebar Shadcn UI.
Issue: GitHub #80, #68, #70 | Instituto-Nexora/Portal_NEXORA

## [frontend-001 · gate-integridade] — 2026-05-12
GATE-0 executado: company.md, squad frontend-001, agents, project-briefing e critical-rules existem. ADRs frontend carregadas e sem conflito inicial. Session criada sem escrever em `.synapos/`.

## [frontend-001 · rodrigo-react] — 2026-05-12
Implementação incremental concluída: sidebar CMS Shadcn-like, rota /cms/dashboard/perfil, hooks de tema/fonte, avatar upload preparado, responsividade no formulário de edição de evento e migration SQL 00004. OTP real e exclusão definitiva permanecem como próxima etapa segura.

## [frontend-001 · rodrigo-react] — 2026-05-12
Bug-fix visual pós-teste: removido scroll externo horizontal/vertical no CMS, adicionado scroll interno estilizado (`nexora-scrollbar`), ajustada responsividade/min-width da página de perfil e corrigido estado colapsado da sidebar para ocultar labels e preservar a logo.
<!-- /RECENTES -->
