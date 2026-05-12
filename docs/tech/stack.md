# NEXORA — Tech Stack

> Stack validada com o fundador em 2026-04-25.

---

## Stack Atual (em produção / codebase)

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| Runtime UI | React | 19.2.4 |
| Linguagem | TypeScript | ^5 |
| Estilização | Tailwind CSS | ^4 |
| Componentes | Shadcn/UI | ^4.4.0 |
| Primitivos UI | Base UI (`@base-ui/react`) | ^1.4.1 |
| Ícones | Lucide React | ^1.11.0 |
| Utilities | clsx + tailwind-merge + CVA | latest |
| Animações | tw-animate-css | ^1.4.0 |
| Otimização | React Compiler | habilitado |
| Linting | Biome | 2.2.0 |
| Fontes | Geist Sans + Geist Mono | via next/font |

---

## Stack Planejada (a integrar)

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Auth + Database | Supabase | BaaS: PostgreSQL + Auth em um serviço (ver ADR 002) |
| Pagamento | Stripe | Pagamentos internacionais |
| Vídeo | Vimeo / YouTube privado | Hospedagem de aulas |
| Deploy | Vercel | Deploy automático via Git |

---

## Ferramentas de Desenvolvimento

| Ferramenta | Finalidade |
|---|---|
| Biome | Lint + Format (substitui ESLint + Prettier) |
| TypeScript strict | Type safety completa |
| `@types/react` + `@types/node` | Tipagens |

---

## Versões Críticas

- **Next.js 16** — possui breaking changes em relação ao Next.js 15. Antes de adicionar código, leia `node_modules/next/dist/docs/`.
- **React 19** — React Compiler habilitado. Evitar padrões de otimização manual desnecessários (`useMemo`, `useCallback` excessivos).
- **Tailwind v4** — configuração e sintaxe diferem do Tailwind v3. Não assumir compatibilidade com plugins antigos.
- **Base UI** — primitivos sem estilo (alternativa ao Radix UI). Não confundir com Shadcn (que usa CVA + Tailwind por cima).

---

## O que NÃO está na stack

- ❌ ESLint / Prettier (substituídos pelo Biome)
- ❌ App mobile nativo
- ❌ GraphQL (API REST via Next.js Route Handlers)
- ❌ Redis / cache externo (não planejado no MVP)
- ❌ Mercado Pago (descartado — apenas Stripe no MVP)
