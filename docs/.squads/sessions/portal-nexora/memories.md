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
## [Querino · frontend-001] — Autenticação e Banco de Dados
- **[DECISÃO CRÍTICA] Sincronização Auth/Profile:** A criação do perfil do aluno (`student_profiles`) não deve ser feita via requisição do frontend. Foi implementado um Database Trigger (`handle_new_user`) no PostgreSQL que escuta a tabela `auth.users` do Supabase para garantir resiliência a falhas de rede.
- **[DECISÃO CRÍTICA] Padrão MVVM (ADR-004):** Todos os novos formulários (Cadastro, Login, Nova Senha) seguiram estritamente o padrão `view.tsx`, `viewModel.tsx`, `schema.ts` e `actions.ts`. `page.tsx` permanece como Server Component.
- **Gerenciamento de Estado de Mutação:** Padronizamos o uso do hook `useActionState` (nativo do React 19) combinado com `startTransition` para controlar os 4 estados de UI (idle, loading, error, success) das Server Actions, eliminando estados manuais.


## Sessão 2026-05-06
Task: Fluxo de eventos — CRUD completo (CMS) + listagem/detalhe (plataforma pública). Issues #34–40.
Issue: #34, #35, #39, #40 (feature:eventos)
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
## Sessão 2026-05-02
Task: Criar identidade visual para o Portal Nexora — redesign completo da home como protótipo. Análise de concorrentes (Udemy, Alura, Hotmart). Úrsula UI lidera o design system e layout.
Issue: —

## [frontend-001 · ana-arquitetura-fe + ursula-ui] — 2026-05-02

[DECISÃO CRÍTICA] Identidade Visual NEXORA aprovada:
- Primary: Deep Teal — `--brand-primary: oklch(0.45 0.12 175)` (~teal-700 #0F766E) — remapeia `--primary` do Shadcn
- Hero bg: `--brand-teal-hero: oklch(0.20 0.07 175)` (~teal-900 #0D3D37) — background escuro sólido, sem gradiente
- CTAs: Amber — `--brand-accent: oklch(0.75 0.16 85)` (~amber-500 #F59E0B) — cor de ação primária
- Tokens definidos em `src/components/layout/globals.css` no `:root`
- `--primary` Shadcn remapeado para teal — afeta todos os componentes que usam `bg-primary`

[DECISÃO CRÍTICA] Estrutura de seções da home (ordem aprovada):
HeroSection → ImpactoSection → CursosDestaque → ProjetosSociais → TestimonialsSection → ParceirosCTA

Novo componente: `TestimonialsSection.tsx` — dados estáticos hardcoded em page.tsx (3 depoimentos)
HeroSection: recebe `stats` como prop — split layout desktop, stack mobile
## [frontend-001 · ana-arquitetura-fe] — 2026-05-06

[DECISÃO CRÍTICA] Padrões aprovados — Fluxo de Eventos:
- `src/utils/formatDate.ts` é o utilitário canônico para formatação de datas pt-BR — não duplicar em componentes
- `slugify()` em `src/utils/slugify.ts` é o padrão para geração de slug server-side (ADR-FE-002)
- Schema Zod sem `.transform()` para campos numéricos de formulário — converter manualmente na Server Action
- `.url()` do Zod v4 está depreciado — usar `z.string().optional()` + `type="url"` no input HTML
- `createAdminClient()` é exclusivo do CMS; páginas públicas devem usar `createClient()` (anon + RLS)
- Padrão de delete sem form: `useTransition` + Server Action chamada direto no handler
## [Renata Revisão] — Proteção de Rotas e UI
- **Segurança (Middleware):** A validação de rotas é feita via `middleware.ts` na raiz. A pasta `minha-area` foi encapsulada no Route Group `(privates)` para isolamento físico das rotas públicas.
- **Navegação (Header):** Transformado em Server Component (`async function Header()`). O botão dinâmico substitui "Entrar" por "Sair" e revela opções do Painel logado lendo diretamente o cookie do servidor, otimizando o TTI (Time to Interactive).
- **Row Level Security (RLS):** A regra fundamental de segurança de dados foi aplicada: Alunos só podem realizar `SELECT` e `UPDATE` nos seus próprios perfis e visualizar suas próprias matrículas via políticas RLS (`auth.uid()`).
<!-- /RECENTES -->
