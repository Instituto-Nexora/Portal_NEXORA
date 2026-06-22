# Decisão Arquitetural: crud-aulas-admin

**Data:** 2026-06-06
**Agent:** Ana Arquitetura

---

## Entendimento da Task

Implementar CRUD completo de aulas dentro de cursos no painel CMS admin (issue #20). A listagem de aulas vive em `/cms/dashboard/cursos/[cursoId]` (nova rota de detalhe do curso), com rotas filhas para criação e edição. Depende de: #18 (schema Supabase) + #19 (CRUD de cursos — concluído). O schema `lessons` não existe ainda no banco — deve ser criado como migration `00007_lessons_schema.sql`.

---

## Estrutura de Rotas

```
/cms/dashboard/cursos/[cursoId]              → detalhe do curso + listagem de aulas
/cms/dashboard/cursos/[cursoId]/aulas/nova   → formulário de criação
/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar → formulário de edição
```

---

## Estrutura de Arquivos

```
src/
├── databases/
│   └── 00007_lessons_schema.sql             ← NOVA migration

src/app/(cms)/cms/dashboard/cursos/[cursoId]/
├── page.tsx                                 ← Server Component — busca curso + aulas, renderiza AulasCMSView
│
├── _features/AulasCMS/                      ← listagem + ações (deletar, toggle publicação, reordenar)
│   ├── actions.ts                           ← deletarAula, togglePublicacaoAula
│   ├── model.ts                             ← re-export Aula de @/lib/supabase/types
│   ├── view.tsx                             ← "use client" — tabela com drag-order + ações
│   └── viewModel.tsx                        ← "use client" — filtro, handlers com useTransition
│
├── aulas/
│   ├── nova/
│   │   ├── page.tsx                         ← Server Component simples → <NovaAulaView cursoId={cursoId} />
│   │   └── _features/NovaAula/
│   │       ├── actions.ts                   ← criarAula(cursoId, _prev, formData): "use server"
│   │       ├── schema.ts                    ← aulaSchema (fonte única)
│   │       ├── view.tsx                     ← "use client" — form RHF
│   │       └── viewModel.tsx                ← "use client" — useActionState + useForm + startTransition
│   │
│   └── [aulaId]/
│       └── editar/
│           ├── page.tsx                     ← Server Component — await params, busca aula por ID
│           └── _features/EditarAula/
│               ├── actions.ts               ← atualizarAula(aulaId, _prev, formData): "use server"
│               ├── view.tsx                 ← "use client" — form pré-populado
│               └── viewModel.tsx            ← "use client" — atualizarCurso.bind(null, aulaId)
│
└── editar/                                  ← já existe (issue #19) — não modificar
```

**Arquivo de tipos a atualizar:**
```
src/lib/supabase/types.ts                    ← adicionar type Aula
```

---

## Schema do Banco de Dados (migration)

```sql
-- 00007_lessons_schema.sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_position ON lessons(course_id, position);
```

---

## Zod Schema (`aulaSchema`)

```typescript
// NovaAula/schema.ts — fonte única, importada por EditarAula
export const aulaSchema = z.object({
  title: z.string().min(3, "Título obrigatório (mínimo 3 caracteres)"),
  video_url: z.string().url("URL de vídeo inválida").optional().or(z.literal("")),
  position: z.number().int().min(0, "Posição inválida"),
  duration_seconds: z.number().int().min(0, "Duração inválida").optional(),
  is_published: z.boolean(),
})
export type AulaFormData = z.infer<typeof aulaSchema>
```

> **Regra Zod v4:** `z.number()` puro (não `z.coerce.number()`) + `{ valueAsNumber: true }` no RHF register.
> `z.boolean()` sem `.default()` + `is_published: false` nos `defaultValues` do useForm.

---

## Type `Aula` (src/lib/supabase/types.ts)

```typescript
type Aula = {
  id: string
  course_id: string
  title: string
  video_url: string | null
  position: number
  duration_seconds: number | null
  is_published: boolean
  created_at: string
}
```

---

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Lista de aulas | initialAulas (Server → prop) + useState local | SSR inicial, sem React Query (Server Actions invalidam via revalidatePath) |
| Formulário | RHF + Zod resolver | ADR-004 obrigatório |
| Ação server | useActionState | API canônica Next.js 16 para Server Actions |
| Pending state | isPending (useActionState) | Desabilitar botão durante submit |
| Filtro/busca | useState string | Estado UI local, sem impacto no servidor |

---

## Padrão de Submit (RHF + Server Actions)

```typescript
// viewModel.tsx — padrão canônico (ADR-FE-023)
const onSubmit: SubmitHandler<AulaFormData> = (data) => {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("video_url", data.video_url ?? "")
  formData.append("position", String(data.position))
  formData.append("duration_seconds", data.duration_seconds ? String(data.duration_seconds) : "")
  formData.append("is_published", String(data.is_published))
  startTransition(() => formAction(formData))
}
// view.tsx — NUNCA action={formAction}
// <form onSubmit={handleSubmit(onSubmit)}>
```

---

## ADR

### ADR-FE-024: Schema de aulas co-localizado em NovaAula

**Contexto:** EditarAula precisa do mesmo schema de validação que NovaAula. Duplicar causaria divergência.
**Decisão:** `aulaSchema` vive em `NovaAula/schema.ts`, importado por `EditarAula` via `@/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/schema`.
**Alternativas rejeitadas:** Schema em `_features/` raiz — estrutura não prevista no MVVM atual.
**Consequências:** ✅ Fonte única de validação / ⚠ Import path longo (mitigado pelo alias `@/`)

---

## Arquivos a Modificar / Criar

- `src/databases/00007_lessons_schema.sql` ← criar
- `src/lib/supabase/types.ts` ← adicionar `type Aula`
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/page.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/_features/AulasCMS/actions.ts` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/_features/AulasCMS/model.ts` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/_features/AulasCMS/view.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/_features/AulasCMS/viewModel.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/page.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/actions.ts` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/schema.ts` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/view.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/nova/_features/NovaAula/viewModel.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar/page.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar/_features/EditarAula/actions.ts` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar/_features/EditarAula/view.tsx` ← criar
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar/_features/EditarAula/viewModel.tsx` ← criar

---

## Pontos de Atenção para o Dev

1. **`params` é Promise no Next.js 16:** `const { cursoId } = await params` e `const { aulaId } = await params` — obrigatório nas pages com segmentos dinâmicos
2. **`course_id` não vai no form:** é passado diretamente via `atualizarCurso.bind(null, cursoId)` e lido no action — não expor no formulário
3. **Reordenação:** `position` é editado manualmente via campo number (sem drag-and-drop complexo)
4. **`duration_seconds` opcional:** pode ser null no banco — tratar `""` como `undefined` no action
5. **Revalidação:** `revalidatePath("/cms/dashboard/cursos/${cursoId}")` após cada mutação
6. **`[cursoId]/page.tsx` co-existe com `[cursoId]/editar/`:** não há conflito de rota no App Router
