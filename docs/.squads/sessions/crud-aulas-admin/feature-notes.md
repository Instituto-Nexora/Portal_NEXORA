# Feature Notes — crud-aulas-admin

**Data:** 2026-06-06
**Squad:** frontend-001
**Issue:** #20

---

## O que foi implementado

CRUD completo de aulas dentro de cursos no painel CMS (`/cms/dashboard/cursos/[cursoId]`), seguindo o padrão MVVM do projeto.

### Rotas criadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/cms/dashboard/cursos/[cursoId]` | `page.tsx` | Listagem de aulas do curso |
| `/cms/dashboard/cursos/[cursoId]/aulas/nova` | `nova/page.tsx` | Formulário de criação |
| `/cms/dashboard/cursos/[cursoId]/aulas/[aulaId]/editar` | `editar/page.tsx` | Formulário de edição |

### Arquivos criados

```
src/databases/
└── 00007_lessons_schema.sql       ← migration: tabela lessons

src/app/(cms)/cms/dashboard/cursos/[cursoId]/
├── page.tsx
├── _features/AulasCMS/
│   ├── actions.ts    (deletarAula, togglePublicacaoAula)
│   ├── model.ts      (re-export Aula)
│   ├── view.tsx      (tabela + diálogo de confirmação)
│   └── viewModel.tsx (busca + handlers com useTransition)
├── aulas/
│   ├── nova/
│   │   ├── page.tsx
│   │   └── _features/NovaAula/
│   │       ├── actions.ts    (criarAula → redirect após sucesso)
│   │       ├── schema.ts     (aulaSchema — fonte única)
│   │       ├── view.tsx      (form com RHF + erros inline)
│   │       └── viewModel.tsx (useActionState + useForm + startTransition)
│   └── [aulaId]/editar/
│       ├── page.tsx          (busca aula por ID, notFound() se inexistente)
│       └── _features/EditarAula/
│           ├── actions.ts    (atualizarAula → redirect após sucesso)
│           ├── view.tsx      (form pré-populado)
│           └── viewModel.tsx (atualizarAula.bind(null, course_id, aula.id))
```

### Arquivos modificados

- `src/lib/supabase/types.ts` — Adicionado `type Aula` + export

---

## Schema do banco

```sql
-- 00007_lessons_schema.sql (executar no Supabase)
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

## Padrões aplicados

- **MVVM** (ADR-004): `page.tsx` Server Component + `view.tsx` Client + `viewModel.tsx` Client
- **Submit pattern** (ADR-FE-023): `startTransition(() => formAction(formData))` — não `action={formAction}`
- **Schema compartilhado**: `aulaSchema` em `NovaAula/schema.ts`, importado por `EditarAula` via `@/`
- **`Promise.all`** na page de listagem para buscar curso e aulas em paralelo
- **`NaN` handling**: `duration_seconds` usa `.or(z.nan().transform(() => undefined))` para campo vazio com `valueAsNumber: true`

---

## Dependências de outras issues

| Issue | Relação |
|-------|---------|
| #18 | Pré-requisito — schema base + RLS |
| #19 | Pré-requisito — cursos já existem (FK `course_id`) |
| #21 | Depende desta — player precisa de `video_url` das aulas |

---

## Notas para futuras implementações

- `00007_lessons_schema.sql` precisa ser executado no Supabase antes do deploy
- Upload de vídeo via Supabase Storage está fora do escopo do #20 (campo aceita URL externa)
- Reordenação drag-and-drop pode ser adicionada futuramente — `position` já suporta
