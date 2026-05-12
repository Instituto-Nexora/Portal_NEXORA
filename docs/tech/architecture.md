# NEXORA — Arquitetura do Sistema

> Validado com o fundador em 2026-04-25. Projeto em estágio MVP inicial.

---

## Visão Geral

O NEXORA é uma aplicação **fullstack monolítica** construída com Next.js App Router. Frontend e backend (API routes) coexistem no mesmo repositório e são deployados juntos na Vercel.

```
┌─────────────────────────────────────────┐
│               Browser                   │
└──────────────────┬──────────────────────┘
                   │ HTTP / RSC
┌──────────────────▼──────────────────────┐
│           Next.js (Vercel)              │
│  ┌────────────────┐  ┌───────────────┐  │
│  │  App Router    │  │ Route Handlers│  │
│  │  (RSC + SSR)   │  │  (/api/*)     │  │
│  └───────┬────────┘  └───────┬───────┘  │
└──────────┼───────────────────┼──────────┘
           │                   │
┌──────────▼───────────────────▼──────────┐
│                Supabase                 │
│  ┌────────────┐  ┌────────────────────┐ │
│  │    Auth    │  │  PostgreSQL (DB)   │ │
│  └────────────┘  └────────────────────┘ │
└─────────────────────────────────────────┘
           │
┌──────────▼──────────┐  ┌────────────────┐
│       Stripe        │  │ Vimeo / YouTube │
│  (pagamentos)       │  │   (vídeos)      │
└─────────────────────┘  └────────────────┘
```

---

## Componentes do Sistema

### 1. Frontend (Next.js App Router)
- **Server Components (RSC)** — renderização no servidor por padrão
- **Client Components** — apenas onde necessário (interatividade, hooks)
- **Layouts aninhados** — estrutura de layout via `layout.tsx`

### 2. API (Next.js Route Handlers)
- Localização: `src/app/api/`
- Padrão REST
- Autenticação via Supabase JWT

### 3. Banco de Dados (Supabase / PostgreSQL)
- Planejado — ainda não implementado
- Entidades esperadas: `users`, `courses`, `lessons`, `enrollments`, `events`, `orders`
- RLS (Row Level Security) do Supabase para controle de acesso

### 4. Autenticação (Supabase Auth)
- Planejado — ainda não implementado
- Gerenciamento de sessão via Supabase

### 5. Pagamentos (Stripe)
- Planejado — ainda não implementado
- Webhooks para confirmar compras e liberar acesso

### 6. Vídeo (Vimeo / YouTube privado)
- Planejado — ainda não implementado
- Embed protegido nas aulas

---

## Fluxo Principal (MVP)

```
Visitante → Landing Page → Checkout (Stripe)
                                    ↓
                          Webhook Stripe confirma
                                    ↓
                          Supabase: libera acesso
                                    ↓
                          Aluno → Área do aluno → Aulas (vídeo embed)
```

---

## Decisões Confirmadas

- [ADR 001](adr/001-app-router.md) — Next.js App Router
- [ADR 002](adr/002-supabase-baas.md) — Supabase como BaaS
- [ADR 003](adr/003-tailwind-v4.md) — Tailwind CSS v4
- [ADR 004](adr/004-mvvm-page-architecture.md) — Arquitetura MVVM de páginas
- [ADR 005](adr/005-type-only-convention.md) — Type-only convention
- [ADR 006](adr/006-utils-reusable-functions.md) — Funções reutilizáveis em `src/utils/`
- [ADR 007](adr/007-cn-classname-utility.md) — `cn()` para todo `className` em JSX
- [ADR 008](adr/008-visual-identity.md) — Identidade Visual: Deep Teal + Amber

---

## Sistema de Design

### Identidade Visual

Paleta **Deep Teal + Warm Amber**, definida em `src/components/layout/globals.css` via CSS custom properties.

| Papel | Token / Tailwind | Hex | Uso |
|---|---|---|---|
| Primary | `--brand-primary` / `teal-700` | `#0F766E` | Botões, ícones, `--primary` Shadcn |
| Hero/Header/Footer bg | `--brand-teal-hero` / `teal-900` | `#0D3D37` | Dark surfaces |
| CTA / Accent | `--brand-accent` / `amber-500` | `#F59E0B` | Ações primárias, destaques |
| Heading claro | `slate-900` | `#0F172A` | H1/H2 em fundo branco |
| Body claro | `slate-600` | `#475569` | Parágrafos em fundo branco |

> Ver [ADR-008](adr/008-visual-identity.md) para regras completas de uso.

### Estrutura de Layout (Páginas Públicas)

```
PublicsLayout (layout.tsx)
├── Header       — bg-teal-900, nav links, CTA amber
├── {page}       — conteúdo da rota
└── Footer       — bg-teal-900, links teal-300
```

### Home Page — Ordem das Seções

```
HeroSection → ImpactoSection → CursosDestaque → ProjetosSociais → TestimonialsSection → ParceirosCTA
```

---

## Estado Atual do Codebase

- **Home:** Identidade visual implementada (teal/amber), 6 seções, TestimonialsSection novo
- **CMS:** Auth completo (login, register, logout), dashboard, cadastro de admins, proteção de rotas via `proxy.ts`
- **Eventos:** Página de listagem implementada
- **Auth pública:** Issues GitHub abertas (#26–#33)
- **Banco de dados:** Supabase planejado — ainda sem migrations
- **Pagamentos:** Stripe planejado — ainda não implementado
