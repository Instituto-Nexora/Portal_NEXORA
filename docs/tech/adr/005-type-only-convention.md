# ADR-005: Type-Only Convention (nunca interface)

**Status:** Accepted
**Date:** 2026-02-23
**Deciders:** Tech Lead
**Updated:** 2026-04-25

---

## Context

TypeScript oferece duas formas de definir contratos de objetos: `interface` e `type`. O projeto precisava escolher uma convenção única para:
- Eliminar discussões desnecessárias sobre qual usar
- Garantir consistência no codebase
- Simplificar a geração de código por IA

---

## Decision

**Usar exclusivamente `type` em todo o projeto. Nunca usar `interface`.**

---

## Regras

### 1. Tipos de objetos

```typescript
// ✅ CORRETO
type User = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
};

// ❌ INCORRETO
interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
}
```

### 2. Tipos derivados de Zod (preferência)

```typescript
// ✅ CORRETO: derivar type do schema Zod
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginForm = z.infer<typeof loginSchema>;

// ❌ INCORRETO: definir type manualmente quando há schema Zod
type LoginForm = {
  email: string;
  password: string;
};
```

**Regra:** Se existe um schema Zod para o dado, o `type` deve ser derivado com `z.infer<typeof schema>`. Nunca duplicar definições.

### 3. ViewModels e props de componentes

```typescript
// ✅ CORRETO: ViewModel tipado com type
export type LoginFormViewModel = {
  onSubmit: SubmitHandler<FormLoginPayload>;
  form: UseFormReturn<FormLoginPayload>;
  isRedirecting: boolean;
};

// ✅ CORRETO: Props com type
type Props = {
  courseId: string;
  className?: string;
};

// ❌ INCORRETO: interface para props
interface Props {
  courseId: string;
}
```

### 4. Unions e intersections

```typescript
// ✅ Unions (só type pode fazer isso)
type EnrollmentStatus = "active" | "completed" | "cancelled";

// ✅ Intersections
type AdminUser = User & { permissions: string[] };

// ✅ Mapped types
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

### 5. Constantes de lookup (use `as const` + `type`)

```typescript
// ✅ CORRETO
const USER_ROLES = [
  { value: "student", label: "Aluno" },
  { value: "admin", label: "Administrador" },
] as const;

type UserRole = typeof USER_ROLES[number];

// ❌ INCORRETO: enum (preferir union de strings)
enum Role {
  STUDENT = "student",
  ADMIN = "admin",
}
```

**Nota sobre enums:** Preferir union types a enums TypeScript. Exceção: valores já definidos no backend como strings (usar union type espelhando os valores).

---

## Onde declarar os types

| Tipo | Local |
|---|---|
| Type específico de uma feature | `features/*/model.ts` ou `_features/*/model.ts` |
| Type compartilhado entre features | `src/types/*.ts` |
| Type derivado de Zod | Junto com o schema (`schema.ts` ou `src/schemas.ts`) |
| Type do ViewModel | No próprio `viewModel.tsx` (exportado) |

---

## Consequences

### Positivas ✅
- **Consistência:** Um padrão só — sem debater `interface` vs `type` em review
- **Poder expressivo:** `type` suporta unions, intersections, mapped types — `interface` não
- **AI-friendly:** Claude Code gera `type` consistentemente
- **Zod-first:** Tipos derivados do schema garantem single source of truth

### Negativas ❌
- **Declaration merging perdida:** `interface` permite declarar o mesmo nome duas vezes (merging). Este padrão não é usado no projeto.
- **Mensagens de erro ligeiramente diferentes:** Em alguns casos `interface` tem erros mais legíveis — impacto mínimo.

---

## Rationale

**Por que não `interface`?**

`interface` foi historicamente preferida para objetos porque permitia declaration merging (útil para extensão de tipos de bibliotecas). No entanto:
- O NEXORA não estende tipos de bibliotecas externas via declaration merging
- `type` é mais poderoso (unions, intersections, conditional types)
- Com Zod como fonte de verdade, a maioria dos tipos é derivada de schemas — `z.infer<>` retorna um `type`, não `interface`

---

## Alternatives Considered

### `interface` para objetos, `type` para unions/intersections
**Rejeitado:** Cria ambiguidade. Desenvolvedores precisam decidir caso a caso.

### Usar `interface` por padrão (convenção clássica TS)
**Rejeitado:** O projeto usa Zod amplamente; `z.infer<>` retorna `type`. Misturar criaria inconsistência.

---

## Related Decisions

- [ADR-004: MVVM Page Architecture](004-mvvm-page-architecture.md) — ViewModel tipado com `type`
