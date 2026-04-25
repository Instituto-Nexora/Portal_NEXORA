# Tech Stack — Portal NEXORA

> Estado em 2026-04-25.

---

## Stack Atual (no codebase)

| Camada | Tecnologia | Versão |
|---|---|---|
| **Linguagem** | TypeScript | ^5 |
| **Framework** | Next.js (App Router) | 16.2.4 |
| **Runtime UI** | React | 19.2.4 |
| **Estilização** | Tailwind CSS | ^4 |
| **Componentes** | Shadcn/UI | ^4.4.0 |
| **Primitivos UI** | Base UI (`@base-ui/react`) | ^1.4.1 |
| **Ícones** | Lucide React | ^1.11.0 |
| **Utilitários** | clsx + tailwind-merge + CVA | latest |
| **Animações** | tw-animate-css | ^1.4.0 |
| **Otimização** | React Compiler | habilitado |
| **Linter/Formatter** | Biome | 2.2.0 |
| **Fontes** | Geist Sans + Geist Mono | via next/font |
| **Package Manager** | npm | (package-lock.json) |

## Stack Planejada (não instalada)

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Auth + DB** | Supabase | PostgreSQL + Auth + RLS |
| **Pagamento** | Stripe | Checkout de cursos/eventos |
| **Vídeo** | Vimeo / YouTube privado | Hospedagem de aulas |
| **Deploy** | Vercel | Deploy automático |
| **Validação** | Zod | Schema + derivação de types |
| **Formulários** | React Hook Form | Formulários com validação |

## Test Runner

⚠️ **Não detectado** — nenhum framework de testes configurado.

## Banco de Dados e Infraestrutura

- **Docker:** não detectado
- **Migrations:** não detectadas
- **CI/CD:** não configurado

## Notas Importantes

- **Next.js 16** tem breaking changes vs 15 — consultar `node_modules/next/dist/docs/`
- **React 19** com React Compiler ativo — evitar `useMemo`/`useCallback` desnecessários
- **Tailwind v4** — sem `tailwind.config.js`; configuração via CSS
- **Dois lock files** (`package-lock.json` e `yarn.lock`) detectados na raiz — usar `npm` como padrão
