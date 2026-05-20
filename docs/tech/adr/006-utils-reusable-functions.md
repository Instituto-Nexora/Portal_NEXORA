# ADR-006: Utils — Funções Reutilizáveis

**Status:** Accepted
**Date:** 2026-02-23
**Deciders:** Tech Lead
**Updated:** 2026-04-25

---

## Context

O projeto acumula funções auxiliares (formatadores, validadores, helpers, etc.) que são usadas em múltiplos pontos do codebase. Sem uma convenção clara, essas funções tendem a ser:
- Duplicadas dentro de features (cada feature implementa `formatDate` do zero)
- Embutidas em ViewModels ou componentes, tornando-as difíceis de testar ou reutilizar
- Espalhadas em locais inconsistentes (`lib/`, `helpers/`, inline nos componentes)

---

## Decision

**Toda função pura e reutilizável deve ser extraída para `src/utils/`. Nunca duplicar lógica utilitária entre features.**

---

## Regras

### 1. Quando criar um util

Criar um arquivo em `src/utils/` quando:
- A função **não tem efeitos colaterais** (pure function)
- A função **pode ser usada em 2 ou mais features** (Rule of Three — após a segunda duplicação, extrair)
- A função **não depende de estado React** (sem hooks, sem contextos)
- A função é um **formatter, validator, helper de URL, ou utilitário de dados**

```typescript
// ✅ CORRETO: funções reutilizáveis vão em utils/
// src/utils/formatDate.ts
export const formatDate = (input: unknown, locale = "pt-BR"): string => {
  if (input === null || input === undefined) return "N/D";
  const date = input instanceof Date ? input : new Date(String(input));
  if (Number.isNaN(date.getTime())) return "N/D";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// ❌ INCORRETO: duplicar formatação de data em cada feature
// features/cursos/viewModel.tsx
const formattedDate = new Date(course.createdAt).toLocaleDateString("pt-BR"); // ❌
```

### 2. Nomenclatura de arquivos

Um arquivo por responsabilidade, em **camelCase**:

| Prefixo | Propósito | Exemplo |
|---|---|---|
| `format*` | Formatar dados para exibição | `formatDate.ts`, `formatDuration.ts`, `formatPrice.ts`, `formatNumber.ts` |
| `validate*` | Validar dados (fora de schemas Zod) | `validateCpf.ts` |
| `generate*` | Gerar valores ou estruturas | `generateSearchParams.ts` |
| `get*` | Extrair ou derivar dados | `getInitials.ts`, `getPasswordStrength.ts` |
| `check*` | Verificar condições booleanas | `checkPermissions.ts` |
| `notify*` | Disparar notificações/toasts de UI | `notifyStatus.ts` |
| Nome descritivo | Outros helpers | `downloadFile.ts`, `environment.ts`, `parseError.ts` |

### 3. Funções canônicas — obrigatoriamente em `src/utils/`

As funções abaixo são exemplos confirmados que **nunca** devem ser implementadas inline ou duplicadas em features:

| Função | Arquivo | Descrição |
|---|---|---|
| `formatNumber` | `src/utils/formatNumber.ts` | Formatação de números com separador de milhar, decimais e moeda |
| `notifyStatus` | `src/utils/notifyStatus.ts` | Wrapper de toast/sonner para feedback de sucesso, erro e loading |
| `getPasswordStrength` | `src/utils/getPasswordStrength.ts` | Calcula força da senha (weak / medium / strong) sem estado React |

```typescript
// src/utils/formatNumber.ts
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat("pt-BR", options).format(value);

export const formatCurrency = (value: number): string =>
  formatNumber(value, { style: "currency", currency: "BRL" });

// src/utils/notifyStatus.ts
import { toast } from "sonner";

export const notifyStatus = (status: "success" | "error" | "loading", message: string) => {
  if (status === "success") toast.success(message);
  else if (status === "error") toast.error(message);
  else toast.loading(message);
};

// src/utils/getPasswordStrength.ts
export type PasswordStrength = "weak" | "medium" | "strong";

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 6) return "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
};
```

### 4. Estrutura de um util

```typescript
// src/utils/formatDuration.ts

// ✅ CORRETO: função pura, sem side effects, exportada nomeada
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
};

// ✅ CORRETO: múltiplas funções relacionadas no mesmo arquivo
export const formatDurationReadable = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  if (minutes === 0) return `${remaining} seg`;
  if (remaining === 0) return `${minutes} min`;
  return `${minutes} min ${remaining} seg`;
};

export const formatCourseDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}h` : `${hours}h ${rem}m`;
};
```

**Regras de estrutura:**
- Exportações **nomeadas** (não default), exceto quando há motivo específico
- Funções relacionadas podem conviver no mesmo arquivo
- Sem dependências de framework (sem `import { useState } from 'react'`)
- Sem chamadas HTTP — utils são funções de transformação de dados

### 5. O que NÃO vai em utils/

```typescript
// ❌ INCORRETO: hook React não pertence a utils/
// src/utils/useDebounce.ts  ← ERRADO — vai em src/hooks/
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value); // ❌
  ...
};

// ❌ INCORRETO: chamada HTTP não pertence a utils/
// src/utils/fetchCourse.ts  ← ERRADO — vai em src/services/ ou Route Handler
export const fetchCourse = async (id: string) => {
  return await fetch(`/api/courses/${id}`); // ❌
};

// ❌ INCORRETO: constantes de domínio não pertencem a utils/
// src/utils/roles.ts  ← ERRADO — vai em src/types/ ou features/*/model.ts
export const ROLES = ["student", "admin"]; // ❌
```

| O que é | Onde vai |
|---|---|
| Função pura reutilizável | `src/utils/` |
| Custom hook React | `src/hooks/` |
| Chamada HTTP / fetch | `src/services/` ou Route Handler (`app/api/`) |
| Constante de domínio | `src/types/` ou `features/*/model.ts` |
| Schema de validação | `src/schemas.ts` ou `features/*/schema.ts` |
| Componente reutilizável | `src/components/` |

### 6. Importação

```typescript
// ✅ CORRETO: importar pelo caminho absoluto com alias @/
import { formatDate } from "@/utils/formatDate";
import { formatDuration, formatCourseDuration } from "@/utils/formatDuration";

// ❌ INCORRETO: importar por caminho relativo em outras features
import { formatDate } from "../../../../utils/formatDate"; // ❌
```

---

## Exemplo prático

**Antes (errado) — lógica duplicada no ViewModel:**
```typescript
// features/cursos/viewModel.tsx
const formattedDate = new Date(course.createdAt)
  .toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

// features/certificados/viewModel.tsx
const formattedDate = new Date(cert.issuedAt)
  .toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
```

**Depois (correto) — util centralizado:**
```typescript
// features/cursos/viewModel.tsx
import { formatDate } from "@/utils/formatDate";
const formattedDate = formatDate(course.createdAt);

// features/certificados/viewModel.tsx
import { formatDate } from "@/utils/formatDate";
const formattedDate = formatDate(cert.issuedAt);
```

---

## Consequences

### Positivas ✅
- **DRY (Don't Repeat Yourself):** Lógica de formatação/validação em um só lugar
- **Testabilidade:** Funções puras são triviais de testar (input → output esperado)
- **Manutenção:** Corrigir `formatDate` em um lugar propaga para todo o projeto
- **Descoberta:** Desenvolvedor (e AI) sabe onde buscar antes de implementar do zero
- **Consistência:** Todos os componentes formatam datas da mesma forma

### Negativas ❌
- **Overhead para funções one-off:** Uma função usada em apenas um lugar pode não precisar de um arquivo próprio
- **Mitigação:** Aplicar Rule of Three — extrair somente após segunda duplicação confirmada

---

## Alternatives Considered

### Embutir no ViewModel
**Rejeitado:** Lógica não reutilizável, impossível de testar isoladamente, código duplicado.

### Criar barrel `utils/index.ts`
**Rejeitado:** Barrel imports aumentam bundle size (importa tudo mesmo que só uma função seja usada). Importar diretamente do arquivo específico é mais eficiente.

### Colocar em `lib/`
**Rejeitado:** `lib/` no NEXORA é reservado para clientes de serviços externos (Supabase, Stripe). `utils/` é para funções puras de transformação de dados.

---

## Related Decisions

- [ADR-004: MVVM Page Architecture](004-mvvm-page-architecture.md) — ViewModel usa utils para formatação
- [ADR-005: Type-Only Convention](005-type-only-convention.md) — utils exportam `type` quando necessário
- [ADR-007: cn() para className](007-cn-classname-utility.md) — exceção: `cn()` mora em `src/lib/utils.ts`
