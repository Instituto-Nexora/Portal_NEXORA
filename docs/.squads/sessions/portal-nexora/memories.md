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
## [frontend-001 · ana-arquitetura-fe] — 2026-04-30

[DECISÃO CRÍTICA] Padrões aprovados — CMS Criar Admin:
- `createAdminClient()` em `src/lib/supabase/admin.ts` (service role, sem cookies) — separado de `createClient()`
- `auth.admin.createUser` + rollback `deleteUser` se profile falhar — padrão de consistência para criações em dois passos
- `flatten((issue) => issue.message)` é o padrão Zod v4 (sem args está depreciado)
- `viewModel.tsx` separado de `view.tsx` é o padrão correto (ADR-004) — features CMS antigas não seguem, esta é a referência

## Sessão 2026-04-30 (run 3)
Task: CMS — Formulário de cadastro de novos administradores seguindo ADRs
Issue: —

## Sessão 2026-04-30 (run 2)
Task: CMS — Segurança, domínios e proteção
Decisões documentadas em docs/tech/security/cms-domain-architecture.md
- Mesmos arquivos, 2 deploys Vercel (portal-nexora + portal-nexora-cms)
- hostname check no proxy.ts bloqueia nexora.com/cms/*
- RLS no Supabase protege admin_profiles
- Service role key só no projeto CMS

## Sessão 2026-04-30 (run 1)
Task: Criar fluxo CMS — Login/Logout admin, cadastro de admin, sidebar/navbar, schema de roles (admin, content_creator, professor), conexão Supabase
Issue: —
Arquivos criados: 21 arquivos (lib/supabase/*, app/(cms)/cms/*, components/cms/*)
Build: ✓ Compiled successfully — sem erros TypeScript
Review: Renata Revisão — ✅ Aprovado para merge

## [frontend-001 · rodrigo-react] — 2026-04-30
Task: Implementar CMS auth completo conforme architecture.md
Decisões tomadas:
- `proxy.ts` (renomeado de middleware.ts para evitar conflito com Next.js 16) protege /cms/* exceto /cms/login e /cms/register
- Tabela `admin_profiles` para profiles (roles: admin, content_creator, professor)
- Dashboard layout verifica sessão + busca profile — profile null é aceitável se não existir ainda

## [frontend-001 · renata-revisao-fe] — 2026-04-30
Review do CMS:
- [BLOCKER] Nenhum encontrado
- [SUGGESTION] Considerar next/image no SidebarUserMenu (img tag com eslint-disable)
- [QUESTION] Profile pode ser null se não existir em admin_profiles — garantir via RLS
- [PRAISE] cn() em todos className, type-only, RHF + Zod, proteção dupla (proxy + layout)

## Sessão 2026-04-25
Task: Converter HTML/CSS/JS legado para Next.js App Router + Tailwind v4

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
