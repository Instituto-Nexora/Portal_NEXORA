# Feature Notes — player-aula

**Data:** 2026-06-15
**Squad:** frontend-001
**Issue:** #21

---

## O que foi implementado

Player de vídeo para aulas na área do aluno, com sidebar de navegação e marcação de progresso.

### Rotas criadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/minha-area/cursos/[cursoId]/aulas` | `aulas/page.tsx` | Redirect para 1ª aula publicada |
| `/minha-area/cursos/[cursoId]/aulas/[aulaId]` | `[aulaId]/page.tsx` | Player + sidebar |

### Arquivos criados

```
src/databases/
└── 00008_lesson_progress_schema.sql

src/app/(publics)/minha-area/cursos/[cursoId]/
├── aulas/page.tsx
└── aulas/[aulaId]/
    ├── page.tsx
    └── _features/PlayerAula/
        ├── actions.ts    (marcarAulaConcluida — upsert idempotente)
        ├── view.tsx      (player iframe + sidebar)
        └── viewModel.tsx (useState Set<string> + useTransition)
```

### Arquivos corrigidos

| Arquivo | Fix |
|---------|-----|
| `src/utils/calcularProgressoCurso.ts` | `.eq("status", "published")` → `.eq("is_published", true)` |
| `src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx` | href `/cursos/` → `/minha-area/cursos/{id}/aulas` |

---

## Schema do banco

```sql
-- 00008_lesson_progress_schema.sql (executar no Supabase)
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
```

---

## Padrões aplicados

- **MVVM** (ADR-004): `page.tsx` Server Component + `view.tsx` Client + `viewModel.tsx` Client
- **`createClient()`** (não admin) — usa sessão do aluno autenticado
- **Verificação de matrícula** no Server Component — redireciona para `/vendas` se não matriculado
- **Validação de `course_id`** na query da aula — impede acesso cross-course
- **`upsert` idempotente** — UNIQUE(user_id, lesson_id) + onConflict evita duplicatas
- **Estado otimista local** — `Set<string>` atualizado sem re-fetch do servidor

---

## Dependências de outras issues

| Issue | Relação |
|-------|---------|
| #18 | Schema base |
| #20 | `lessons` table + `video_url` |
| #22 | `lesson_progress` integração de progresso |
| #26 | Auth Supabase — `getUser()` |
