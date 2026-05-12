@AGENTS.md

# Portal NEXORA

> Gerado por /setup:discover em 2026-04-25

---

## Projeto

| Campo | Valor |
|---|---|
| **Nome** | portal_nexora |
| **Stack** | TypeScript / Next.js 16 App Router / React 19 / Tailwind v4 / Shadcn |
| **Arquitetura** | Fullstack monolítico Next.js |
| **Frontend** | Next.js App Router + Shadcn/UI |
| **Backend** | Next.js Route Handlers (a implementar) |
| **Testes** | Não configurado |

---

## Regras Críticas

> Extraídas das ADRs ativas — não-negociáveis.

- **`page.tsx` é sempre Server Component** — nunca `"use client"`, nunca hooks
- **Toda página com lógica segue MVVM** em `_features/` (view / viewModel / model / schema)
- **Formulários**: React Hook Form + Zod obrigatórios — proibido `useState` para campos
- **Nunca `interface`** — usar exclusivamente `type` em todo o projeto
- **`cn()` obrigatório** em todo `className` JSX — importar de `@/lib/utils`
- **Funções puras reutilizáveis** vão em `src/utils/` — nunca duplicar entre features
- **Tailwind v4**: sem `tailwind.config.js` — configuração via CSS em `globals.css`
- **Next.js 16** tem breaking changes — ler `node_modules/next/dist/docs/` antes de escrever código
- **Supabase Service Role Key** nunca vai ao cliente — apenas server-side

---

## Estrutura do Framework

| Diretório | Conteúdo |
|---|---|
| `.synapos/core/` | Protocolos core do Framework Synapos |
| `.synapos/squads/` | Squads instanciados e seus agents |
| `docs/tech/` | Documentação técnica do projeto |
| `docs/tech/adr/` | Architecture Decision Records (001–007) |
| `docs/business/` | Contexto de negócio |
| `docs/tech-context/` | Briefing gerado pelo /setup:discover |
| `docs/_memory/stack.md` | Stack para agents (Tier 0) |
