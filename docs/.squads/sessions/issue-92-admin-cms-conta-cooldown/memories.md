# Memória: issue-92-admin-cms-conta-cooldown

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-05-24
Task: Corrigir issue #92 — remover exclusão de conta no CMS e ajustar cooldown para limite diário de 5 alterações.
Issue: GitHub #92

## [frontend-001 · rodrigo-react] — 2026-05-24
Quick Fix: Removida exclusão de conta do CMS e trocado cooldown por limite diário de 5 alterações.
Abordagem: Histórico móvel de 24h em `user_metadata`, mantendo o padrão existente sem nova migration.

## [frontend-001 · rodrigo-react] — 2026-05-24
Quick Fix: Adicionado crop nativo de avatar, fallback por iniciais e correções de lint/build.
Abordagem: Canvas nativo sem dependência externa; `UserAvatar` centraliza o fallback visual e o contraste em temas claro/escuro.

## [frontend-001 · rodrigo-react] — 2026-05-24
Quick Fix: Removida duplicidade de “Perfil” na sidebar mobile do CMS.
Abordagem: Mantido o item canônico “Perfil” da navegação principal e removido o atalho duplicado do bloco mobile do menu do usuário.
<!-- /RECENTES -->
