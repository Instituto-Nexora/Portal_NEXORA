---
gerado: 2026-04-25
auto_detectado: false
---
# Stack do Projeto

**Linguagem:** TypeScript 5
**Runtime/Versão:** Node.js (Next.js runtime)
**Framework:** Next.js 16.2.4 (App Router)
**Package Manager:** npm (package-lock.json)
**ORM / Banco:** não implementado — Supabase (PostgreSQL) planejado
**Validação:** Zod (planejado, não instalado ainda)
**Test Runner:** não detectado
**Linter / Formatter:** Biome 2.2.0

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

> Gerado por /setup:discover em 2026-04-25.
> Agents usam este contexto para adaptar exemplos, imports e estruturas de pastas ao projeto real.
> Para atualizar: edite este arquivo ou execute /setup:discover novamente.
