# Contexto: cms-profile-sidebar-events

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.
> Criado em: 2026-05-12 | Squad: frontend-001

## O que é
Implementar melhorias no CMS relacionadas a perfil de usuário, dropdown/rota de perfil, troca de foto, sidebar Shadcn UI e responsividade do formulário de edição de eventos.

Escopo solicitado pelo usuário:
- GitHub #80 — DropDown / rota de perfil do usuário (CMS), acessibilidade, tema, fonte, dados pessoais, avatar, senha com OTP, skeleton.
- GitHub #68 — Mudança de foto de perfil com Supabase Storage e troca automática da foto anterior.
- GitHub #70 — Rota de perfil do usuário com dados, senha, fonte global, exclusão de conta, restrições e toasts.
- Ajustar responsividade no formulário de edição de evento.
- Alterar a sidebar do CMS para a Sidebar do Shadcn UI conforme https://ui.shadcn.com/docs/components/radix/sidebar.

## Por que existe
Administradores precisam gerenciar dados pessoais e preferências de acessibilidade no CMS, e a navegação/admin precisa ficar mais consistente, acessível e responsiva.

## Decisões tomadas
- Role ativo: frontend-001.
- Session de trabalho: docs/.squads/sessions/cms-profile-sidebar-events/.
- Não foi alterado `.synapos/squads/frontend-001/squad.yaml`, pois as instruções do projeto proíbem escrita dentro de `.synapos/`.
- O trabalho deve respeitar ADRs aceitas: App Router, Tailwind v4 via CSS, MVVM, type-only, utils reutilizáveis e cn() em className.

## O que não fazer
- Não criar Pages Router.
- Não colocar `"use client"` em `page.tsx`.
- Não criar `tailwind.config.js`.
- Não usar `interface`.
- Não escrever dentro de `.synapos/`.
- Não expor Supabase Service Role Key no cliente.

## Pendências de decisão
[?] Definir se a entrega desta sessão será incremental/MVP ou implementação integral com backend completo (Storage, OTP, cooldown de 2h e exclusão de conta).
[?] Definir se a Sidebar Shadcn será adicionada via CLI/registry (`npx shadcn add sidebar`) ou implementada manualmente adaptada ao estilo Base UI já usado no projeto.
[?] Definir local dos hooks globais: issue #80 pede `/src/app/hooks/useTheme.ts`, enquanto components.json usa alias `@/hooks` para `src/hooks` e a issue #70 sugere `src/hooks`.
