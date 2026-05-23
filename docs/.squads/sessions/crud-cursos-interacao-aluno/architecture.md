# Decisão Arquitetural: Minha Área — Cursos do Aluno

**Data:** 2026-05-15
**Agent:** Ana Arquitetura

## Entendimento da Task

Página "Meus Cursos" na área logada do aluno que lista cursos matriculados com barra de progresso e link para as aulas. A rota `src/app/(private)/minha-area/page.tsx` já existe mas viola ADR-004 (MVVM) — todo o fetch, lógica e JSX estão inline num Server Component de 170 linhas com N+1 queries de progresso. Precisamos refatorar para MVVM, eliminar o N+1 e extrair componentes reutilizáveis.

## Estrutura de Componentes

```
src/_features/minha-area/
├── minha-area.view.tsx           → Server Component de apresentação
├── minha-area.viewmodel.tsx      → Client hook p/ interatividade futura
├── components/
│   ├── course-card.tsx            → Card individual do curso
│   ├── course-card-skeleton.tsx   → Estado de loading
│   └── empty-state.tsx            → Estado vazio (sem matrículas)
├── hooks/
│   └── use-minha-area.ts          → Hook do ViewModel
├── types/
│   └── minha-area.types.ts        → Tipos da feature
└── minha-area.utils.ts            → Funções puras

src/app/(private)/minha-area/
├── page.tsx                       → Server Component (fetch + delegar)
├── loading.tsx                    → Loading state (skeleton)
└── cursos/
    └── [cursoId]/
        └── page.tsx               → Detalhe do curso (fora do escopo)
```

**Justificativa da estrutura:** `_features/` é a primeira do projeto conforme ADR-004. A colocation garante que tudo da feature está num só lugar. Os componentes `CourseCard`, `EmptyState` e `CourseCardSkeleton` são extraídos do monólito atual para serem testáveis e reutilizáveis.

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| enrollments + cursos + progresso | Server Component fetch | Dados imutáveis na sessão, semmutação no cliente. Busca única no servidor. |
| loading | Next.js `loading.tsx` | Nativo do App Router, evita estado artificial no cliente. |
| empty | Server Component conditional | Renderizado condicionalmente no servidor — sem estado. |
| future: filtro/sort | `useState` no ViewModel | Estado local de UI, sem compartilhamento. Adicionar quando necessário. |

## Contratos dos Componentes Principais

```typescript
// types/minha-area.types.ts
import type { Curso } from "@/lib/supabase/types";

type CursoComProgresso = Curso & {
  enrollmentId: string;
  progressPercent: number;
  totalAulas: number;
  aulasConcluidas: number;
};

type MinhaAreaViewModel = {
  cursos: CursoComProgresso[];
  isEmpty: boolean;
};

// minha-area.viewmodel.tsx — contrato do hook
function useMinhaAreaViewModel(cursos: CursoComProgresso[]): MinhaAreaViewModel;

// minha-area.view.tsx — contrato do Server Component
type MinhaAreaViewProps = {
  cursos: CursoComProgresso[];
};

// components/course-card.tsx
type CourseCardProps = {
  curso: CursoComProgresso;
};

// components/empty-state.tsx (stateless, sem props além de className se necessário)

// components/course-card-skeleton.tsx (stateless)
```

## ADR

### ADR-001: Server-First MVVM para Páginas Read-Only
**Contexto:** ADR-004 determina MVVM para toda página com lógica. A página "Meus Cursos" é read-only (sem formulários, sem mutação de estado no cliente). Um ViewModel com zero lógica seria noise arquitetural.
**Decisão:** Adotar "Server-First MVVM" — `page.tsx` faz fetch (Model), `view.tsx` renderiza (View), `viewModel.tsx` existe como hook exportado mas só ganha implementação quando houver interatividade cliente (filtro, sort, paginação).
**Alternativas rejeitadas:** ViewModel completo agora — camada vazia que aumentaria complexidade sem benefício. Fundir tudo em `page.tsx` — viola ADR-004 e dificulta manutenção.
**Consequências:** ✅ Estrutura MVVM preparada para crescimento sem over-engineering / ⚠ Um hook exportado mas não consumido inicialmente — pode confundir devs que esperam uso imediato.

### ADR-002: Progresso via Campo Direto no Banco
**Contexto:** O código atual faz N+1 queries: para cada matrícula, busca total de aulas e conta concluídas. O tipo `CourseEnrollment` em `src/lib/supabase/types.ts:35` já possui campo `progress_percent: number | null` — sinal de que o schema espera esse dado persistido.
**Decisão:** Abolir o cálculo inline. `page.tsx` lê `enrollment.progress_percent` diretamente da tabela `course_enrollments`. A responsabilidade de manter esse campo atualizado é do banco (trigger Postgres ou função agendada).
**Alternativas rejeitadas:** Manter cálculo inline — N+1 escala mal e duplica lógica que o banco já deveria prover. Criar view materializada — complexidade desnecessária para um campo que já existe na schema.
**Consequências:** ✅ Elimina N+1, consulta única / ⚠ Requer trigger/função no banco para manter `progress_percent` sincronizado. Se o trigger não existir, o dado fica desatualizado.

### ADR-003: _features como Padrão de Colocation
**Contexto:** ADR-004 menciona colocation em `_features/` mas o diretório não existe no projeto. Esta é a primeira feature a usá-lo.
**Decisão:** Criar `src/_features/minha-area/` como primeiro diretório de feature. O padrão é: um diretório por rota significativa (não por página trivial). O nome em kebab-case, sem plural.
**Alternativas rejeitadas:** Manter tudo em `src/components/` — espalharia a feature. Criar `src/features/` sem underscore — o underscore previne collision com rota Next.js App Router.
**Consequências:** ✅ Estabelece padrão para features futuras / ⚠ Time precisa aprender o padrão. Migração de features existentes (se houver) postergada.

## Mapeamento page.tsx → MVVM

O page.tsx atual mescla 3 responsabilidades. O refactor separa:

```
page.tsx atual (170 linhas)                    page.tsx novo (~30 linhas)
├── Auth check (5L)                     →      ├── Auth check + fetch
├── Fetch enrollments (5L)              →      ├── Fetch + join + format
├── Fetch courses (5L)                  →      └── Render <MinhaAreaView />
├── N+1 progress loop (20L)             →
├── Empty state JSX (30L)               →      view.tsx (~50 linhas)
├── List + Card JSX (70L)               →      ├── Empty state (delegado p/ EmptyState)
└── Button/Link JSX (15L)              →       └── Grid + CourseCard
```

## Plano de Refatoração

1. Criar `src/_features/minha-area/` com toda a estrutura
2. Extrair `CursoComProgresso` type (derivado de `Curso`)
3. Extrair componentes: `CourseCard`, `EmptyState`, `CourseCardSkeleton`
4. Reescrever `page.tsx` — remover todo JSX, manter só fetch + delegar para `MinhaAreaView`
5. Criar `loading.tsx` com `CourseCardSkeleton` grid
6. Adicionar `minha-area.viewmodel.tsx` com hook vazio (pronto para filtro/sort futuro)
7. Criar trigger DB para manter `course_enrollments.progress_percent` atualizado

## Pontos de Atenção para o Dev

- **`_features/` não existe ainda** — criar diretório manualmente na primeira vez
- **`course_enrollments.progress_percent`** — verificar se o trigger Postgres já existe ou precisa ser criado. Se não existir, o progresso ficará sempre `null`.
- **Server Component vs Client Component** — `view.tsx` e `CourseCard` podem ser Server Components desde que não usem hooks, event handlers, ou `useEffect` (ADR-004 + Next.js 16). O Button com `render` prop do Shadcn funciona em Server Component se o Button não for marcado `"use client"`.
- **cn() obrigatório** — todo `className` deve usar `cn()`, inclusive classes estáticas (ADR-007)
- **Nunca usar `interface`** — usar exclusivamente `type` (ADR-005)
- **Loading state** — usar `loading.tsx` do App Router, não estado cliente. O skeleton replica o grid do view.tsx com `CourseCardSkeleton`.
- **Empty state** — movido do inline atual para componente próprio, mas permanece condicional server-side
- **Link de "Ver Catálogo"** — atualmente aponta para `/cursos`. Verificar se essa rota existe no grupo `(publics)` ou `(private)`.
- **Import alias** — usar `@/` para imports da feature para arquivos em `src/` (ex: `import { cn } from "@/lib/utils"`)
