# Arquitetura — cms-profile-sidebar-events

> Gerado em: 2026-05-12 | Squad: frontend-001
> Decisões aprovadas pelo usuário: entrega incremental, hooks em `src/hooks`, sidebar Shadcn adaptada ao stack atual.

## ADRs aplicadas

- [RESPEITADA] ADR-001 — Next.js App Router: novas rotas em `src/app/(cms)/cms/dashboard/...`; `page.tsx` segue Server Component.
- [RESPEITADA] ADR-003 — Tailwind v4: sem `tailwind.config.js`; ajustes via classes e tokens existentes.
- [RESPEITADA] ADR-004 — MVVM Page Architecture: rota de perfil com `_features/Perfil` contendo `view.tsx`, `viewModel.tsx`, `schema.ts`, `actions.ts` e `model.ts`.
- [RESPEITADA] ADR-005 — Type-only: usar `type`, nunca `interface`.
- [RESPEITADA] ADR-006 — Utils: funções puras compartilhadas em `src/utils/` se necessário.
- [RESPEITADA] ADR-007 — `cn()` em `className`.
- [RESPEITADA] ADR-008 — identidade Deep Teal + Amber preservada nos CTAs e estados principais.

## Escopo funcional aprovado

Entrega incremental para as issues #80, #68 e #70:

1. Sidebar CMS
   - Criar componente `src/components/ui/sidebar.tsx` compatível com a composição Shadcn: `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, grupos e menu.
   - Migrar `CMSShell`, `Sidebar`, `SidebarNav`, `SidebarUserMenu` e `TopBar` para o novo padrão.
   - Remover dependência do drawer mobile manual, usando o provider/trigger da sidebar.

2. Perfil CMS
   - Criar rota `/cms/dashboard/perfil`.
   - Criar UI incremental com dados pessoais, avatar, preferências de tema/fonte, segurança e zona de perigo.
   - Persistir nome/avatar via Supabase server actions.
   - Usar cooldown de 2h persistido em Supabase Auth metadata para não bloquear a entrega por migration pendente.
   - Deixar OTP real e exclusão definitiva de conta como bloqueios explicitados/documentados para próxima etapa.

3. Avatar
   - Upload para bucket `avatars` em path estável por usuário (`admin-profiles/{userId}/avatar.ext`) com `upsert`, substituindo arquivo anterior.
   - Atualizar `profiles.avatar_url` e metadados Auth.

4. Acessibilidade visual
   - Hooks globais em `src/hooks/useTheme.ts` e `src/hooks/useChangeFont.ts`.
   - Persistência em `localStorage` e aplicação no `documentElement`.

5. Responsividade do formulário de edição de evento
   - Ajustar header, grid de campos, cards e ações para mobile.
   - Manter RHF/Zod e estrutura existente.

6. Documentação/migrations
   - Criar SQL de referência em `src/databases/00004_cms_profile_preferences.sql` com bucket avatars, colunas opcionais de cooldown e políticas.
   - Criar notas da feature na session.

## Arquivos autorizados para modificar/criar

- `src/components/layout/globals.css`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/input-otp.tsx`
- `src/hooks/useTheme.ts`
- `src/hooks/useChangeFont.ts`
- `src/components/cms/CMSShell.tsx`
- `src/components/cms/Sidebar/index.tsx`
- `src/components/cms/Sidebar/SidebarNav.tsx`
- `src/components/cms/Sidebar/SidebarUserMenu.tsx`
- `src/components/cms/TopBar/index.tsx`
- `src/components/cms/CMSMobileSidebar.tsx`
- `src/app/(cms)/cms/dashboard/perfil/page.tsx`
- `src/app/(cms)/cms/dashboard/perfil/loading.tsx`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/actions.ts`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/index.tsx`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/model.ts`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/schema.ts`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/view.tsx`
- `src/app/(cms)/cms/dashboard/perfil/_features/Perfil/viewModel.tsx`
- `src/app/(cms)/cms/dashboard/eventos/[id]/_features/EditarEvento/view.tsx`
- `src/databases/00004_cms_profile_preferences.sql`
- `docs/.squads/sessions/cms-profile-sidebar-events/feature-notes.md`
- `docs/.squads/sessions/cms-profile-sidebar-events/review-notes.md`
- `docs/.squads/sessions/cms-profile-sidebar-events/memories.md`
- `docs/.squads/sessions/cms-profile-sidebar-events/state.json`
- `docs/.squads/sessions/cms-profile-sidebar-events/session.manifest.json`

## Riscos e mitigação

- Shadcn doc aponta instalação por CLI; para evitar dependência Radix extra e preservar stack Base UI, a sidebar será implementada localmente com API compatível.
- OTP e exclusão de conta real exigem decisão/configuração de fluxo Supabase Auth/admin. Serão sinalizados na UI e documentados como próxima etapa.
- Cooldown em metadata Auth evita quebrar ambientes sem migration aplicada. SQL opcional documenta colunas em `profiles` para endurecimento futuro.
