---
gerado: 2026-05-09
auto_detectado: false
---

> Este arquivo mantém o contexto da stack tecnológica unificada para guiar os agentes e squads do projeto Portal NEXORA.

# Stack do Projeto

**Linguagem:** TypeScript 5
**Runtime/Versão:** Node.js (Next.js runtime)
**Framework:** Next.js 16.2.4 (App Router)
**UI Runtime:** React 19.2.4 (com React Compiler ativado)

## Estilização & Componentes
**Estilos:** Tailwind CSS v4 + PostCSS
**Componentes Base:** Shadcn/UI + Base UI
**Ícones:** Lucide React

## Dados, Backend & Autenticação
**BaaS:** Supabase
**Banco de Dados:** PostgreSQL
**Autenticação:** Supabase Auth (via `@supabase/ssr` cookies)

## Formulários & Validação
**Gerenciador de Formulários:** React Hook Form
**Schema & Validação:** Zod
**Mutations:** Server Actions com uso de `useActionState` nativo do React 19

## Ferramentas de Qualidade
**Linting e Formatação:** Biome (O projeto NÃO utiliza ESLint ou Prettier)

## Padrões Arquiteturais Definidos
**Padrão de UI:** Arquitetura MVVM (Model-View-ViewModel) estrita.
**Componentização:** `page.tsx` sempre atua como Server Component (sem `"use client"`). Componentes interativos vivem em `_features/`.
**Gerenciamento de Estado:** Sem hooks genéricos (`useState`) para formulários; delegar ao RHF + Zod.

## Estrutura de Pastas

```
src/
├── app/              # App Router — rotas, layouts, páginas
│   ├── layout.tsx    # Layout raiz
│   ├── page.tsx      # Página inicial
│   └── globals.css   # Estilos globais + variáveis Tailwind v4
├── components/
│   └── ui/           # Componentes Shadcn/UI
└── lib/
    └── utils.ts      # cn() — clsx + tailwind-merge

docs/
├── business/         # Contexto de negócio
├── tech/             # Documentação técnica + ADRs
└── tech-context/     # Briefing gerado pelo /setup:discover

public/               # Assets estáticos servidos pelo Next.js
```

## Banco de Dados e Infraestrutura

- **Banco planejado:** Supabase (PostgreSQL gerenciado)
- **Auth planejada:** Supabase Auth
- **Pagamento planejado:** Stripe
- **Vídeo planejado:** Vimeo / YouTube privado
- **Deploy:** Vercel
- **Docker:** não detectado
- **Migrations:** não detectadas

## Notas

> Gerado por /setup:discover em 2026-05-29.
> Agents usam este contexto para adaptar exemplos, imports e estruturas de pastas ao projeto real.
> Para atualizar: edite este arquivo ou execute /setup:discover novamente.
