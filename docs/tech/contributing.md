# NEXORA — Guia de Contribuição

> Workflow e convenções do projeto em 2026-04-25.

---

## Setup Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Lint
npm run lint

# Format
npm run format

# Build
npm run build
```

---

## Antes de Escrever Código

**LEIA ANTES:** Este projeto usa Next.js 16, React 19 e Tailwind v4 — todos com breaking changes em relação às versões anteriores.

- Next.js 16: consulte `node_modules/next/dist/docs/` para APIs atuais
- Tailwind v4: configuração via CSS, não via `tailwind.config.js`
- React 19: React Compiler ativo — evite otimizações manuais desnecessárias

---

## Convenções de Código

### Nomenclatura
- Componentes: PascalCase (`CourseCard.tsx`)
- Hooks: camelCase com prefixo `use` (`useCourseProgress.ts`)
- Utilitários: camelCase (`formatPrice.ts`)
- Constantes: UPPER_SNAKE_CASE (`MAX_LESSON_DURATION`)
- Tipos: PascalCase com sufixo descritivo (`CourseWithLessons`, `EnrollmentStatus`)

### Estrutura de um componente
```tsx
// imports externos
import { useState } from "react"
import { cn } from "@/lib/utils"

// imports internos
import { Button } from "@/components/ui/button"

// types
interface Props {
  courseId: string
  className?: string
}

// componente
export function CourseCard({ courseId, className }: Props) {
  // ...
}
```

### Server vs Client Components
- Padrão: Server Component (sem `"use client"`)
- Use `"use client"` apenas para: eventos DOM, `useState`, `useEffect`, browser APIs

---

## Linting

O projeto usa **Biome** — não instale ESLint ou Prettier.

```bash
npm run lint      # verifica
npm run format    # formata e corrige
```

---

## CI/CD

- **Deploy:** Vercel (automático ao fazer push na branch `main`)
- **CI:** ⚠️ A INVESTIGAR — nenhum workflow de CI configurado ainda

---

## Variáveis de Ambiente

A DEFINIR — lista de variáveis necessárias quando as integrações forem implementadas:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Padrões de Commits

```
feat: adicionar página de curso
fix: corrigir layout da landing page
chore: atualizar dependências
docs: atualizar documentação técnica
```
