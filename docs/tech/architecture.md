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

---

## Estado Atual do Codebase

O projeto está na fase de estrutura base. Nenhuma lógica de domínio foi implementada ainda:
- Sem modelos de banco de dados
- Sem rotas de API
- Sem autenticação
- Apenas: layout base, página inicial (template), componente Button do Shadcn
