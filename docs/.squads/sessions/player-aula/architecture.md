# Decisão Arquitetural: player-aula

**Data:** 2026-06-15
**Agent:** Ana Arquitetura

---

## Entendimento da Task

Player de vídeo para aulas na área do aluno (issue #21). O aluno matriculado acessa `/minha-area/cursos/[cursoId]/aulas/[aulaId]`, assiste ao vídeo via iframe, navega entre aulas pela sidebar e marca aulas como concluídas. O Server Component verifica a matrícula antes de renderizar.

Bugs pré-existentes a corrigir:
- `calcularProgressoCurso.ts`: `.eq("status", "published")` → `.eq("is_published", true)`
- `CursoCard.tsx`: href `/cursos/${id}` → `/minha-area/cursos/${id}/aulas` (redirect para primeira aula)

---

## Estrutura de Rotas

```
/minha-area/cursos/[cursoId]/aulas                   → redirect para primeira aula publicada
/minha-area/cursos/[cursoId]/aulas/[aulaId]          → player (feature principal)
```

---

## Estrutura de Arquivos

```
src/
├── databases/
│   └── 00008_lesson_progress_schema.sql   ← migration: tabela lesson_progress

src/app/(publics)/minha-area/cursos/
└── [cursoId]/
    ├── aulas/
    │   ├── page.tsx                        ← Server Component: redirect para 1ª aula publicada
    │   └── [aulaId]/
    │       ├── page.tsx                    ← Server Component: auth + matrícula + dados
    │       └── _features/PlayerAula/
    │           ├── actions.ts              ← marcarAulaConcluida (Server Action)
    │           ├── view.tsx                ← "use client" — player + sidebar
    │           └── viewModel.tsx           ← "use client" — estado de conclusão
```

**Arquivos a corrigir:**
```
src/utils/calcularProgressoCurso.ts         ← fix: is_published ao invés de status
src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx  ← fix: href correto
```

---

## Schema do Banco (migration)

```sql
-- 00008_lesson_progress_schema.sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
```

> UNIQUE constraint garante idempotência — upsert sem duplicatas.

---

## Fluxo de Dados no Server Component (`[aulaId]/page.tsx`)

```
1. createClient() — sessão do aluno (não admin)
2. getUser() — se !user → redirect("/login")
3. enrollments: verifica matrícula do user no curso
   - se não matriculado → redirect("/vendas")
4. Promise.all:
   - lessons: todas as aulas publicadas do curso (ordenadas por position)
   - aula atual: lesson por aulaId
   - progress: lesson_progress do user para este curso
5. se !aula → notFound()
6. render <PlayerAulaView ... />
```

---

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Dados do curso/aulas | Server (props) | SSR — sem re-fetch no client |
| IDs de aulas concluídas | useState (Set<string>) | Estado UI local, atualizado após action |
| isPending marcar conclusão | useTransition | Desabilitar botão durante submit |

---

## Contrato dos Componentes

```typescript
// PlayerAulaView Props
type Props = {
  aula: Aula
  curso: Curso
  aulas: Aula[]             // todas as aulas publicadas, ordenadas por position
  aulasConcluidas: string[] // IDs das aulas já concluídas pelo aluno
  userId: string
}
```

---

## ADR

### ADR-FE-025: iframe para player de vídeo

**Contexto:** O MVP precisa exibir vídeos de YouTube/Vimeo sem complexidade de DRM ou player customizado.
**Decisão:** `<iframe>` nativo com `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"` e `allowFullScreen`.
**Alternativas rejeitadas:** `react-player` (dependência extra, desnecessária para MVP); player Vimeo API (complexidade).
**Consequências:** ✅ Zero dependências extras / ⚠ URL deve ser embed URL (não watch URL) — documentar para conteúdo.

---

## Arquivos a Modificar / Criar

- `src/databases/00008_lesson_progress_schema.sql` ← criar
- `src/utils/calcularProgressoCurso.ts` ← fix: `.eq("is_published", true)`
- `src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx` ← fix: href
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/page.tsx` ← criar (redirect)
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/page.tsx` ← criar
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/actions.ts` ← criar
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx` ← criar
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/viewModel.tsx` ← criar

---

## Pontos de Atenção para o Dev

1. **`lesson_progress` usa `auth.users` (não `student_profiles`)** — a FK deve ser para `auth.users` pois o Server Component usa `supabase.auth.getUser()` que retorna o UUID de auth
2. **iframe URL**: YouTube embed = `https://www.youtube.com/embed/{videoId}`, não a URL de watch
3. **`marcarAulaConcluida` usa upsert** (não insert) — evita erro de UNIQUE constraint em duplo-clique
4. **`aulas/page.tsx` (redirect)**: busca a primeira aula publicada do curso e redireciona — se não houver, notFound()
5. **Sidebar**: link para cada aula via `<Link href={/minha-area/cursos/${cursoId}/aulas/${aula.id}>` — `useParams` no client para destacar aula ativa
