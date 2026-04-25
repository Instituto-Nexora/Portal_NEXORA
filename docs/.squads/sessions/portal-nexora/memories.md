# Memória: portal-nexora

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.
> O pipeline-runner carrega apenas o bloco RECENTES por padrão.
> Para expandir o histórico completo: use /session consolidate.
>
> [DECISÃO CRÍTICA] — use este marcador em entradas que NUNCA devem ser comprimidas.
> Entradas com [DECISÃO CRÍTICA] são permanentes — não são movidas para SUMMARY.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## Sessão 2026-04-25
Task: Converter HTML/CSS/JS legado para Next.js App Router + Tailwind v4
Issue: —
Arquivos: index.html (130 linhas), eventos.html (167 linhas), assets/css/, assets/js/

## [frontend-001 · ana-arquitetura-fe] — 2026-04-25

[DECISÃO CRÍTICA] Padrões aprovados nesta sessão:
- `_features/` com `_` prefix = invisível ao App Router (não gera rotas)
- Componentes de seção são Server Components por padrão; Client Component só quando há interatividade (ex: menu toggle)
- MVVM simplificado (sem view.tsx/viewModel.tsx) é aceitável em páginas puramente estáticas sem formulários
- Dados hardcoded em `page.tsx` são temporários — migrar para server actions/Supabase quando backend estiver pronto
- `/login` no Header é placeholder — rota não existe ainda
- `live_segurança.jpeg` tem `ç` no nome — renomear antes do deploy em produção
## Sessão 2026-04-25 (run 2)
Task: Redesign UI/UX — aplicar componentes Shadcn/UI, melhorar qualidade visual e experiência do usuário
Issue: —
## [produto-001 · priscila-produto] — 2026-04-25
Task: Criar tarefas no GitHub Projects para MVP
Issues criadas: #6 (Landing Page+Checkout), #7 (Módulo Cursos), #8 (Autenticação), #9 (Eventos)
Repositório: Instituto-Nexora/Portal_NEXORA
Labels criadas: feature:landing-page, feature:modulo-cursos, feature:autenticacao, feature:eventos, P0, P1
<!-- /RECENTES -->
