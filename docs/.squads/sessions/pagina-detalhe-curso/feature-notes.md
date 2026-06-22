# Feature Notes: pagina-detalhe-curso

> Issue #25 — Criar página de detalhe do curso com aulas desbloqueadas
> Pipeline: feature-development | Squad: frontend-001
> Concluído em: 2026-06-18

---

## O que foi implementado

### Página de detalhe do curso

**`src/app/(publics)/minha-area/cursos/[cursoId]/page.tsx`**

Server Component. Fluxo de validação:
1. Auth → redirect `/login` se não autenticado
2. Enrollment → `notFound()` se o aluno não está matriculado no curso
3. Fetch paralelo: `courses` + `lessons` (publicadas, ordenadas por `position`)
4. Fetch de `lesson_progress` filtrado pelos `lessonIds` do curso (evita poluição cross-curso)
5. Passa tudo para `DetalhesCursoView`

**`src/app/(publics)/minha-area/cursos/[cursoId]/_features/DetalhesCurso/view.tsx`**

Server Component (sem `"use client"` — ADR-FE-026). Seções:

- **Header teal**: thumbnail do curso, título, descrição, barra de progresso
- **Ação primária**: botão "Começar"/"Continuar" (link para primeira aula) ou "Baixar Certificado" (link para `/api/certificados/[courseId]`) quando `percentual === 100`
- **Ação secundária**: botão "← Minha Área" (link para `/minha-area`)
- **Lista de aulas**: `<ol role="list">`, cada aula com ícone de status (CheckCircle2/Circle), número, título, duração e badge "Concluída"
- **Estado vazio**: mensagem com ícone quando `aulas.length === 0`

### Atualização do CursoCard

**`src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx`**

`continueHref` atualizado de `/minha-area/cursos/${courses.id}/aulas` para `/minha-area/cursos/${courses.id}`. O fluxo passa a ser: listagem → detalhe → player. O redirect `/aulas` é mantido para compatibilidade.

---

## Padrões aplicados

| Padrão | Aplicação |
|--------|-----------|
| ADR-001 (App Router) | `page.tsx` Server Component — sem `"use client"` |
| ADR-002 (Supabase) | `createClient()` — RLS ativa, nunca service role key |
| ADR-004 (MVVM) | `page.tsx` + `_features/DetalhesCurso/view.tsx` |
| ADR-005 (type-only) | Apenas `type`, nunca `interface` |
| ADR-007 (cn()) | `cn()` em todo `className` |
| ADR-009 (Shadcn-first) | `Button`, `Badge`, `Progress`, `Image` — sem HTML nativo |
| ADR-FE-026 (novo) | `view.tsx` sem `"use client"` em páginas puramente display |
| Next.js 16 | `params: Promise<{ cursoId: string }>` com `await params` |

---

## Decisão de escopo

`Set<string>` como prop entre Server Components é válido (sem serialização). Restrição: se `view.tsx` migrar para `"use client"`, a prop precisará ser substituída por `string[]` (Set não é serializável para JSON/RSC). Documentado em `review-notes.md`.

---

## Arquivos criados / modificados

| Arquivo | Operação |
|---------|----------|
| `src/app/(publics)/minha-area/cursos/[cursoId]/page.tsx` | Criado |
| `src/app/(publics)/minha-area/cursos/[cursoId]/_features/DetalhesCurso/view.tsx` | Criado |
| `src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx` | Modificado (continueHref) |
