# ADR-004: MVVM Page Architecture

**Status:** Accepted
**Date:** 2026-02-23
**Deciders:** Tech Lead
**Updated:** 2026-04-25

---

## Context

O projeto necessita de um padrão claro de organização interna de páginas que:
- Separe UI, lógica e tipos de forma consistente
- Garanta que `page.tsx` nunca vire um arquivo com lógica misturada
- Permita que formulários sempre usem React Hook Form com validação Zod
- Seja facilmente entendido por IA (Claude Code) e novos desenvolvedores

---

## Decision

**Toda página com lógica, estado ou formulários deve seguir o padrão MVVM com co-localização em `_features/`.**

### Regra 1: `page.tsx` é sempre Server Component

```typescript
// ✅ CORRETO: page.tsx sem 'use client', sem hooks
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./_features/LoginForm";

export const metadata: Metadata = {
  title: "Entrar - NEXORA",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}

// ❌ INCORRETO: page.tsx com 'use client' e estado
"use client";
export default function LoginPage() {
  const [email, setEmail] = useState(""); // ❌ não fazer isso em page.tsx
  return <input value={email} onChange={e => setEmail(e.target.value)} />;
}
```

**Regras:**
- Nunca adicionar `"use client"` em `page.tsx`
- `page.tsx` pode fazer data fetching (async/await) para Server Components
- Interatividade fica 100% nos componentes filhos (Client Components)
- Usar `<Suspense>` quando o filho precisa de dados assíncronos no client

---

### Regra 2: Estrutura MVVM dentro de `_features/`

Para cada feature co-localizada dentro de uma rota:

```
app/(private)/cursos/
├── page.tsx                          # Server Component (ponto de entrada)
└── _features/
    └── CursosList/
        ├── index.tsx                 # Re-export público
        ├── view.tsx                  # View — 'use client', UI somente (Shadcn)
        ├── viewModel.tsx            # ViewModel — 'use client', toda a lógica
        ├── model.ts                  # Tipos e constantes (sem lógica)
        └── schema.ts                 # Zod schema (OBRIGATÓRIO se tiver formulário)
```

**Diferença entre `_features/` e `features/`:**
- `_features/` → co-localizado dentro da rota (`app/*/`)
- `features/` → feature standalone reutilizável entre rotas

Ambos seguem o mesmo padrão MVVM interno.

---

### Regra 3: viewModel.tsx — ViewModel tipado

O ViewModel é um custom hook que retorna um objeto tipado com `type` (ver ADR-005).

```typescript
// _features/LoginForm/viewModel.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, type UseFormReturn, useForm } from "react-hook-form";
import { type LoginForm, loginSchema } from "@/schemas";

// Tipar o payload e o ViewModel com `type` (nunca interface — ver ADR-008)
export type FormLoginPayload = LoginForm;

export type LoginFormViewModel = {
  onSubmit: SubmitHandler<FormLoginPayload>;
  form: UseFormReturn<FormLoginPayload>;
  isRedirecting: boolean;
};

const useLoginViewModel = (): LoginFormViewModel => {
  const form = useForm<FormLoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit: SubmitHandler<FormLoginPayload> = async (data) => {
    // lógica de submit
  };

  return { onSubmit: handleSubmit, form, isRedirecting: false };
};

export default useLoginViewModel;
```

**Regras do ViewModel:**
- Sempre tem `"use client"` no topo
- Sempre retorna um `type` explícito (ex.: `LoginFormViewModel`)
- Contém toda a lógica: estado, mutations, event handlers, efeitos
- Nunca contém JSX
- O nome do hook segue: `use<FeatureName>ViewModel`

---

### Regra 4: view.tsx — UI somente (Shadcn)

```typescript
// _features/LoginForm/view.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLoginViewModel from "./viewModel";

export default function FormLogin() {
  const { onSubmit, form, isRedirecting } = useLoginViewModel();

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting || isRedirecting}>
        Entrar
      </Button>
    </form>
  );
}
```

**Regras da View:**
- Sempre tem `"use client"` no topo
- Apenas JSX + composição de componentes Shadcn (`@/components/ui/`)
- Zero lógica de negócio — toda lógica no ViewModel
- Recebe dados apenas do ViewModel (nunca fetch direto)

---

### Regra 5: schema.ts — OBRIGATÓRIO quando há formulário

```typescript
// _features/LoginForm/schema.ts  ← OU  @/schemas para schemas globais

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

**Onde colocar o schema:**
| Situação | Local |
|---|---|
| Schema usado apenas por uma feature | `_features/*/schema.ts` ou `features/*/schema.ts` |
| Schema compartilhado entre múltiplas features | `src/schemas.ts` |

**Regras do schema:**
- Sempre usar `z.infer<typeof schema>` para derivar o `type` (nunca definir manualmente)
- Nunca duplicar um schema que já existe em `src/schemas.ts`
- Mensagens de erro em português

---

### Regra 6: React Hook Form é OBRIGATÓRIO para formulários

```typescript
// ✅ OBRIGATÓRIO: useForm + zodResolver
const form = useForm<FormPayload>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

// ❌ PROIBIDO: estado manual para formulários
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

**Justificativa:** Consistência, validação automática, gestão de estado de submissão (`isSubmitting`), error tracking por campo.

---

## Resumo da estrutura completa

```
app/(private)/nova-feature/
├── page.tsx                           # Server Component (sem 'use client')
│                                      # Faz data fetching se necessário
│                                      # Passa dados como props para _features/
└── _features/
    └── NovaFeatureView/
        ├── index.tsx                  # export { default } from './view'
        ├── view.tsx                   # 'use client' — JSX + Shadcn
        ├── viewModel.tsx             # 'use client' — lógica + hooks + form
        ├── model.ts                   # types + constantes (sem lógica)
        └── schema.ts                  # Zod schema (se tem formulário)
```

---

## Consequences

### Positivas ✅

- **Previsibilidade:** Todo dev sabe onde está a lógica (ViewModel) e onde está a UI (View)
- **Testabilidade:** ViewModel pode ser testado independente de JSX
- **AI-friendly:** Claude Code gera código correto seguindo o padrão
- **Manutenção:** Modificar lógica não toca na UI e vice-versa

### Negativas ❌

- **Mais arquivos para features simples:** Uma página com 30 linhas pode ter 4 arquivos
- **Mitigação:** Para páginas verdadeiramente simples (sem form, sem estado), `page.tsx` pode renderizar diretamente um componente Shadcn sem `_features/`

---

## Alternatives Considered

### Tudo em page.tsx
**Rejeitado:** Viola separação de Server/Client Components. page.tsx não pode ter hooks.

### Redux / Zustand para estado global
**Rejeitado:** Estado co-localizado no ViewModel é suficiente para o escopo do MVP. Estado global aumenta complexidade sem benefício claro.

---

## Related Decisions

- [ADR-001: Next.js App Router](001-app-router.md) — Server vs Client Components
- [ADR-005: Type-Only Convention](005-type-only-convention.md) — `type` no ViewModel
