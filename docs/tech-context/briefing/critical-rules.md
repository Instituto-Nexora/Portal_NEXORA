# Regras Críticas — Portal NEXORA

> Extraídas das ADRs com status "Accepted". Não-negociáveis.

---

## [ADR-001] Next.js App Router

- **Nunca usar Pages Router** — o projeto usa exclusivamente App Router
- Antes de escrever qualquer código Next.js, consultar `node_modules/next/dist/docs/` (Next.js 16 tem breaking changes)
- `page.tsx` é sempre **Server Component** — nunca adicionar `"use client"` em page.tsx
- Interatividade fica em componentes filhos (Client Components)

## [ADR-002] Supabase como BaaS

- `SUPABASE_SERVICE_ROLE_KEY` **nunca vai ao cliente** — apenas server-side
- Apenas `NEXT_PUBLIC_SUPABASE_ANON_KEY` é pública
- RLS (Row Level Security) deve ser configurado e testado rigorosamente

## [ADR-003] Tailwind CSS v4

- **Não criar `tailwind.config.js`** — configuração via CSS em `globals.css`
- Tailwind v4 usa `@tailwindcss/postcss`, não o plugin v3
- Plugins do Tailwind v3 podem ser incompatíveis — verificar antes de instalar

## [ADR-004] MVVM Page Architecture

- **Toda página com lógica, estado ou formulários** segue MVVM com co-localização em `_features/`
- `page.tsx`: nunca tem `"use client"`, nunca tem hooks
- `view.tsx`: `"use client"` + JSX com Shadcn — **zero lógica de negócio**
- `viewModel.tsx`: `"use client"` + toda a lógica — **nunca tem JSX**
- `schema.ts`: **OBRIGATÓRIO** quando há formulário (Zod + React Hook Form)
- **React Hook Form é obrigatório** para formulários — proibido `useState` para campos

## [ADR-005] Type-Only Convention

- **Nunca usar `interface`** — exclusivamente `type` em todo o projeto
- Se existe schema Zod, o type **deve ser derivado** com `z.infer<typeof schema>` — nunca duplicar
- Preferir union types a enums TypeScript

## [ADR-006] Utils — Funções Reutilizáveis

- Funções puras reutilizáveis vão em `src/utils/` — nunca duplicar entre features
- Aplicar Rule of Three: extrair para utils após segunda duplicação
- `src/utils/` é para funções puras — sem hooks, sem HTTP, sem constantes de domínio
- Importar sempre via alias: `import { fn } from "@/utils/arquivo"`

## [ADR-007] cn() para className

- **`cn()` é obrigatório em todo `className` JSX/TSX** — sem exceção, mesmo para classes estáticas
- Importar de `@/lib/utils` (não de `@/utils/cn`)
- Condicionais: usar array com objeto `cn(['base', { 'classe': condition }])`
- **Nunca** usar `clsx` ou `twMerge` diretamente nos componentes
