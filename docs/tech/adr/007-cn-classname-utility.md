# ADR-007: cn() para className em JSX

**Status:** Accepted
**Date:** 2026-03-04
**Deciders:** Tech Lead
**Updated:** 2026-04-25

---

## Context

O projeto usa Tailwind CSS para estilização. Em JSX/TSX, o atributo `className` frequentemente precisa combinar classes condicionais, variantes de estado e overrides. Sem uma função utilitária, isso leva a:

- Strings de template frágeis (`className={`base ${cond ? 'a' : 'b'}`}`)
- Conflitos de classes Tailwind (ex.: `p-2` e `p-4` juntos sem merge)
- Inconsistência na forma como desenvolvedores e IA geram JSX com classes dinâmicas

O utilitário `cn()` já existe em `src/lib/utils.ts` (usando `clsx` + `tailwind-merge`) e é usado pelos componentes Shadcn em `src/components/ui/`.

---

## Decision

**Usar sempre `cn()` ao escrever `className` em JSX/TSX — sem exceção.**

Importar de `@/lib/utils`.

---

## Regras

### 1. Uso obrigatório em todo className JSX

```tsx
// ✅ CORRETO — sempre cn(), mesmo para classes estáticas
import { cn } from '@/lib/utils'

<div className={cn(['flex items-center gap-2'])} />

// ✅ CORRETO — condicionais via array + objeto (forma obrigatória)
<div className={cn(['base-class', { active: isActive, 'text-sm': variant === 'sm' }])} />

// ✅ CORRETO — merge de props externas com classes internas
type Props = { className?: string }
<div className={cn(['internal-class', className])} />

// ❌ INCORRETO — string literal estática sem cn()
<div className="flex items-center gap-2" />

// ❌ INCORRETO — template string manual
<div className={`base ${isActive ? 'active' : ''}`} />

// ❌ INCORRETO — concatenação de strings
<div className={'base ' + extraClass} />

// ❌ INCORRETO — && para condicionais (usar objeto dentro do array)
<div className={cn('base', isActive && 'active')} />
```

### 2. Condicionais: array com objeto

```tsx
// ✅ CORRETO — array com objeto para condicionais
<button
  className={cn([
    'rounded px-4 py-2',
    {
      'bg-primary text-white': variant === 'primary',
      'bg-secondary text-black': variant === 'secondary',
      'opacity-50 cursor-not-allowed': disabled,
    },
  ])}
/>

// ❌ INCORRETO — && ou ternário inline
<button className={cn('rounded px-4 py-2', variant === 'primary' && 'bg-primary text-white')} />
<button className={cn('rounded px-4 py-2', disabled ? 'opacity-50' : '')} />
```

### 3. Aceitar e mesclar className externo em componentes

Todo componente que aceita `className` como prop deve passá-lo para `cn()` junto com as classes internas:

```tsx
// ✅ CORRETO
type Props = {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: Props) {
  return (
    <div className={cn(['rounded-lg border p-4', className])}>
      {children}
    </div>
  )
}

// ❌ INCORRETO — concatenar manualmente
<div className={'rounded-lg border p-4 ' + (className ?? '')} />
```

### 4. Importação

```typescript
// ✅ CORRETO — sempre via alias @/ a partir de src/lib/utils
import { cn } from '@/lib/utils'

// ❌ INCORRETO — import relativo
import { cn } from '../../../lib/utils'

// ❌ INCORRETO — usar clsx ou twMerge diretamente nos componentes
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
```

### 5. Exceções permitidas

Nenhuma. `cn()` é obrigatório para todo `className` em JSX, independente de:
- A classe ser estática (sem condicionais)
- O componente ser simples ou complexo
- Ser Server Component ou Client Component

---

## Implementação de `cn()`

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- `clsx`: concatena classes com suporte a arrays, objetos e condicionais
- `twMerge`: resolve conflitos de classes Tailwind (ex.: `p-2 p-4` → `p-4`)

---

## Consequences

### Positivas ✅
- **Merge correto:** `tailwind-merge` resolve conflitos de classes (sem override silencioso)
- **Condicionais limpas:** Array + objeto do `clsx` é declarativo e legível
- **Consistência:** Todo `className` no projeto segue o mesmo padrão
- **Composabilidade:** Componentes com `className?: string` sempre usam `cn()` para merge seguro
- **AI-friendly:** Claude Code gera `cn()` consistentemente — sem variações

### Negativas ❌
- **Import obrigatório:** Cada arquivo com `className` precisa importar `cn`. Overhead mínimo.
- **Classes estáticas "verbosas":** `cn(['flex'])` vs `"flex"` — tradeoff de consistência vs brevidade

---

## Rationale

**Por que array com objeto para condicionais?**

A sintaxe `cn(['base', { 'class': condition }])` é explícita e declarativa. Cada classe condicional é uma chave no objeto com valor booleano — sem ambiguidade sobre quando a classe é aplicada. Evita `&&` que pode vazar `0` como texto no JSX e ternários que adicionam ruído visual.

**Por que mesmo classes estáticas?**

Consistência elimina a decisão de "usar ou não usar cn() aqui". Uma regra absoluta é mais fácil de aplicar em code review e mais previsível para geração de código por IA. Além disso, componentes que começam com classes estáticas frequentemente evoluem para condicionais — usar `cn()` desde o início evita refatoração.

**Por que não `clsx` ou `twMerge` diretamente?**

`cn()` é o wrapper que combina ambos. Usar os utilitários diretamente nos componentes quebraria a camada de abstração. O wrapper já existe em `src/lib/utils.ts` — padrão de projeto que garante que funções reutilizáveis ficam centralizadas.

**Por que `src/lib/utils.ts` e não `src/utils/cn.ts`?**

O Shadcn gera `cn()` em `src/lib/utils.ts` por padrão, e todos os componentes Shadcn já importam de lá. Mover para `src/utils/` quebraria os componentes gerados automaticamente pelo CLI do Shadcn.

---

## Alternatives Considered

### String literals para classes estáticas, cn() apenas para dinâmicas
**Rejeitado:** Cria decisão ambígua em cada `className`. Code review inconsistente.

### && para condicionais (ex.: `cn('base', isActive && 'active')`)
**Rejeitado:** Pode vazar `0` como texto no JSX. Objeto dentro de array é mais declarativo.

### Usar `clsx` diretamente (sem twMerge)
**Rejeitado:** Não resolve conflitos de classes Tailwind. Ex.: `p-2` + `p-4` gera ambos na saída.

---

## Related Decisions

- [ADR-003: Tailwind CSS v4](003-tailwind-v4.md) — Tailwind CSS como base de estilização
- [ADR-006: Utils — Funções Reutilizáveis](006-utils-reusable-functions.md) — exceção: `cn()` mora em `src/lib/utils.ts`, não em `src/utils/`
