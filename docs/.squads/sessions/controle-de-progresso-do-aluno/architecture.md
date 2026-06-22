# Decisão Arquitetural: Controle de Progresso do Aluno por Aula

**Data:** 2026-06-05
**Agent:** Ana Arquitetura
**Issue:** #22 (sub-task da Epic #7 — Módulo de Cursos)

---

## Entendimento da Task

Implementar o sistema de controle de progresso do aluno: (1) utility function `calcularProgressoCurso` que consulta o Supabase e retorna contagem/percentual de conclusão, (2) Server Actions para marcar/desmarcar aulas concluídas, e (3) atualização de `minha-area/page.tsx` para substituir a barra de progresso manual pelo componente Shadcn `Progress`.

## Estrutura de Arquivos

```
src/
├── utils/
│   └── calcularProgressoCurso.ts         ← NEW — função reutilizável (ADR-006)
├── lib/supabase/
│   └── types.ts                           ← UPDATE — adiciona Lesson, LessonProgress, ProgressResult
└── app/(private)/minha-area/
    ├── page.tsx                            ← UPDATE — usa Progress Shadcn + prepara integração real
    └── _features/
        └── MeusCursos/
            └── actions.ts                  ← NEW — Server Actions marcar/desmarcar
```

## Decisões de Estado

| Dado | Tipo | Justificativa |
|------|------|---------------|
| Lista de cursos matriculados | Server fetch (mock → Supabase) | Server Component — sem estado de cliente |
| Progresso por curso | Server fetch via `calcularProgressoCurso` | Calculado no servidor, sem interatividade |
| Marcar aula concluída | Server Action | Mutação do lado do servidor — sem estado local |

## Contratos dos Componentes

```typescript
// calcularProgressoCurso — src/utils/calcularProgressoCurso.ts
async function calcularProgressoCurso(
  courseId: string,
  userId: string,
): Promise<ProgressResult>

// Server Actions — _features/MeusCursos/actions.ts
async function marcarAulaConcluida(aulaId: string): Promise<void>
async function desmarcarAulaConcluida(aulaId: string): Promise<void>

// Tipos novos em types.ts
type Lesson = { id: string; course_id: string; title: string; order: number; status: "published" | "draft"; created_at: string }
type LessonProgress = { id: string; user_id: string; lesson_id: string; completed_at: string }
type ProgressResult = { completedCount: number; totalCount: number; percentage: number }
```

## ADR

### ADR-FE-022: Utility function com acesso a Supabase em `src/utils/`

**Contexto:** ADR-006 diz "funções puras reutilizáveis em `src/utils/`". A função `calcularProgressoCurso` não é pura (faz I/O), mas a issue especifica explicitamente `src/utils/` como destino. A reutilização (video player, área do aluno, CMS) justifica a localização.

**Decisão:** Colocar em `src/utils/calcularProgressoCurso.ts` conforme spec da issue.

**Alternativas rejeitadas:**
- `_features/` — não reutilizável entre routes
- `src/lib/` — reservado a clientes e utilitários de infraestrutura

**Consequências:**
✅ Reutilizável em issues #21 (video player) e futuras
⚠ Função com side effects em pasta de "utils" — excepcionalmente aceito por spec da issue

### ADR-FE-022b: minha-area/page.tsx mantém mock data

**Contexto:** Issues #18 (schema DB) e #21 (video player) são dependências não entregues. As tabelas `lessons` e `lesson_progress` podem não existir em Supabase.

**Decisão:** `page.tsx` mantém mock data mas migra o Progress visual para componente Shadcn. Integração real com `calcularProgressoCurso` é feita via comentário `// TODO: substituir mock pelo fetch real` — função já está disponível para uso imediato quando #18 for entregue.

**Consequências:**
✅ Nenhuma regressão visual
✅ Build não quebra por tabelas ausentes
⚠ Progresso não reflete dados reais até #18 ser entregue

## Pontos de Atenção para o Dev (Rodrigo React)

1. `calcularProgressoCurso` usa `createClient` de `@/lib/supabase/server` — não importar de `client.ts`
2. `Progress` existente usa **Base UI** (`@base-ui/react/progress`), não Radix — respeitar a API: `value` é number 0–100
3. Cores do Progress: componente já usa `bg-primary` (teal-700 via CSS custom property) — não sobrescrever com cor hardcoded
4. Indicador de 100%: usar `indicatorClassName` do componente para aplicar classe de "concluído"
5. Server Actions com `"use server"` e `createClient` do servidor
6. `marcarAulaConcluida` usa upsert por `(user_id, lesson_id)` — evita duplicatas
