# Convenções de Código — Portal NEXORA

> Estado em 2026-04-25. MVP inicial — poucas convenções implementadas. Maioria definida nas ADRs.

---

## Estrutura de Pastas Atual

```
src/
├── app/              # Next.js App Router (rotas e layouts)
├── components/ui/    # Componentes Shadcn/UI
└── lib/utils.ts      # cn() — único utilitário existente
```

**Padrão arquitetural:** Fullstack monolítico Next.js (App Router)
**Service Layer:** não detectado — a criar conforme MVP evolui
**Repository Pattern:** não detectado — Supabase SDK acessa o banco diretamente
**Controllers/Routes:** Next.js Route Handlers em `src/app/api/` (a criar)

---

## Convenções Definidas nas ADRs

### Organização de páginas (ADR-004)
```
app/(grupo)/rota/
├── page.tsx              # Server Component (nunca use client)
└── _features/
    └── FeatureName/
        ├── index.tsx     # re-export
        ├── view.tsx      # use client — JSX + Shadcn
        ├── viewModel.tsx # use client — lógica
        ├── model.ts      # types e constantes
        └── schema.ts     # Zod schema (se formulário)
```

### Tipos (ADR-005)
- Sempre `type`, nunca `interface`
- Types derivados de Zod: `z.infer<typeof schema>`
- Localização: `features/*/model.ts` (específico) ou `src/types/` (compartilhado)

### Utilitários (ADR-006)
- Funções puras → `src/utils/`
- Custom hooks → `src/hooks/` (a criar)
- Chamadas HTTP → `src/services/` ou Route Handlers (a criar)
- Constantes de domínio → `src/types/` ou `features/*/model.ts`

### Estilos (ADR-007)
- `cn()` em todo `className` JSX
- Importar de `@/lib/utils`

---

## Convenções Não Detectadas (a definir)

⚠️ Os seguintes itens não foram detectados no codebase e precisam ser definidos conforme o projeto cresce:

- Estratégia de tratamento de erros
- Padrão de chamadas à API Supabase (client vs server)
- Naming convention para Server Actions (se usadas)
- Convenção de rotas de API (`/api/[recurso]/route.ts`)
- Estratégia de autenticação (middleware vs layout)
