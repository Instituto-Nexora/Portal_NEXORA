# Feature Notes — Controle de Progresso do Aluno por Aula

**Data:** 2026-06-05
**Squad:** frontend-001
**Task:** #22 — Cursos: Implementar controle de progresso do aluno por aula (sub-task da Epic #7)
**Branch:** feat/controle-de-progresso-do-aluno

---

## O que foi implementado

- `src/utils/calcularProgressoCurso.ts` — função assíncrona que consulta `lessons` (publicadas) e `lesson_progress` (do aluno) no Supabase e retorna `{ concluidas, total, percentual }`
- `src/app/(private)/minha-area/_features/MeusCursos/actions.ts` — Server Actions `marcarAulaConcluida(aulaId)` e `desmarcarAulaConcluida(aulaId)` via upsert/delete na tabela `lesson_progress`
- `src/lib/supabase/types.ts` — novos tipos `LessonStatus`, `Lesson`, `LessonProgress`, `ProgressResult`
- `src/app/(private)/minha-area/page.tsx` — migração da barra de progresso manual para o componente Shadcn `<Progress>` com paleta teal (ADR-008 + ADR-009); TODO com integração real documentada

---

## Decisões técnicas

- **`ProgressResult` com nomes em pt-BR** (`concluidas`, `total`, `percentual`): decisão de alinhamento com o tipo `EnrollmentComProgresso` já definido em `CursoCard.tsx` da mesma branch (`feat/listagem-de-cursos`).
- **`upsert` com `onConflict: "user_id,lesson_id"`**: torna `marcarAulaConcluida` idempotente — sem duplicatas mesmo com múltiplas chamadas.
- **`render + nativeButton={false}`** em `Button`: padrão correto para Base UI (sem `asChild` Radix).
- **Mock data preservado** em `(private)/minha-area/page.tsx`: dependências #18 (schema) e #21 (video player) não entregues — integração real documentada via TODO comentado.

---

## Pontos de atenção para manutenção futura

1. **Issue #18 (schema DB):** quando entregue, remover mock data de `(private)/minha-area/page.tsx` e ativar o bloco TODO com fetch real via `calcularProgressoCurso`.
2. **Issue #21 (video player):** `marcarAulaConcluida` e `desmarcarAulaConcluida` devem ser chamados no componente do player ao completar/desmarcar aula.
3. **Constraint única `(user_id, lesson_id)`**: a tabela `lesson_progress` deve ter constraint UNIQUE nessa coluna para o `upsert` funcionar corretamente. Verificar no schema Supabase.
4. **RLS Supabase**: `lesson_progress` deve ter política RLS que garante que cada aluno só acessa seus próprios registros — sem isso, `calcularProgressoCurso` pode vazar dados entre alunos.

---

## SUGGESTIONs pendentes (débito técnico)

- **(Baixa)** Substituir `lessons!.map(...)` por `(lessons ?? []).map(...)` para eliminar non-null assertion
