# NEXORA — Guia de Navegação do Codebase

> Estado do codebase em 2026-04-25 (MVP inicial).

---

## Estrutura de Pastas

```
Portal_NEXORA/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── layout.tsx          # Layout raiz (fontes, metadata global)
│   │   ├── page.tsx            # Página inicial (a substituir pela landing page)
│   │   ├── globals.css         # Estilos globais + variáveis Tailwind
│   │   └── favicon.ico
│   ├── components/
│   │   └── ui/                 # Componentes de UI (Shadcn)
│   │       └── button.tsx      # Componente Button
│   └── lib/
│       └── utils.ts            # Utilitários (cn function = clsx + tailwind-merge)
├── public/                     # Assets estáticos
├── docs/                       # Documentação do projeto
│   ├── business/               # Contexto de negócio
│   └── tech/                   # Documentação técnica (este diretório)
├── .synapos/                   # Sistema Synapos (orquestração de IA)
├── next.config.ts              # Configuração do Next.js
├── tsconfig.json               # Configuração TypeScript
├── biome.json                  # Configuração do Biome (lint + format)
├── components.json             # Configuração do Shadcn
└── package.json
```

---

## Convenções de Código

### Alias de Imports
```typescript
import { cn } from "@/lib/utils"         // src/lib/utils.ts
import { Button } from "@/components/ui/button"  // src/components/ui/button.tsx
```

O alias `@/*` mapeia para `./src/*` (configurado em `tsconfig.json`).

### Componentes UI
- Componentes do Shadcn ficam em `src/components/ui/`
- Componentes de domínio ficam em `src/components/` (fora de `ui/`)
- Componentes de página ficam inline no arquivo de rota ou em `src/components/`

### Server vs Client Components
- Por padrão, todos os componentes são **Server Components**
- Use `"use client"` apenas quando necessário (eventos, hooks de estado, browser APIs)

### Utilitário `cn`
```typescript
import { cn } from "@/lib/utils"

// Combina classes condicionalmente
cn("base-class", condition && "conditional-class", props.className)
```

---

## Onde Adicionar Cada Tipo de Código

| O que | Onde |
|---|---|
| Nova página | `src/app/[rota]/page.tsx` |
| Layout de seção | `src/app/[rota]/layout.tsx` |
| API endpoint | `src/app/api/[rota]/route.ts` |
| Componente UI reutilizável | `src/components/ui/` |
| Componente de domínio | `src/components/` |
| Hook customizado | `src/hooks/` (a criar) |
| Lógica de negócio | `src/lib/` ou `src/services/` (a criar) |
| Types / interfaces | `src/types/` (a criar) |
| Clientes de API | `src/lib/` (ex: `src/lib/supabase.ts`) |

---

## Pastas a Criar (conforme o projeto cresce)

```
src/
├── hooks/          # React hooks customizados
├── types/          # TypeScript types e interfaces globais
├── services/       # Lógica de negócio (ex: course-service.ts)
└── lib/
    ├── supabase.ts # Cliente Supabase
    └── stripe.ts   # Cliente Stripe
```

---

## Linting e Formatação

O projeto usa **Biome** (substitui ESLint + Prettier):

```bash
npm run lint      # biome check — verifica problemas
npm run format    # biome format --write — formata arquivos
```

Configuração em [biome.json](../../biome.json).

---

## Atenção: Versões com Breaking Changes

- **Next.js 16** — APIs podem diferir do que está no seu treinamento. Consulte `node_modules/next/dist/docs/` antes de escrever código.
- **Tailwind v4** — sintaxe de configuração mudou. Não usar `tailwind.config.js` (v3). Configuração via CSS em `globals.css`.
- **React 19** — React Compiler ativado. Não adicionar `useMemo`/`useCallback` sem necessidade real.
