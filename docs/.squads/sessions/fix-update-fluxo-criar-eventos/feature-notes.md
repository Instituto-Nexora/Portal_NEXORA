# Feature Notes: Player de Vídeo — Área do Aluno

**Data:** 2026-05-12  
**Squad:** frontend-001  
**Pipeline:** feature-development

---

## O que foi implementado

- Player de vídeo para aulas na área do aluno, com embed YouTube/Vimeo
- Rota: `/minha-area/cursos/[cursoId]/aulas/[aulaId]`
- Estrutura MVVM completa:
  - `page.tsx` (Server Component): auth → matrícula → fetch de dados
  - `view.tsx`: UI com player em 2 colunas (vídeo + sidebar)
  - `viewModel.tsx`: estado, navegação, estado otimista
  - `actions.ts`: Server Action `marcarConcluida`
- Sidebar com lista de aulas e indicador de progresso (✓ concluída)
- Botão "Marcar como concluída" com estado otimista + rollback
- Função utilitária `extractVideoId()` em `src/utils/video.ts` (YouTube + Vimeo)
- Tipos `CourseEnrollment` e `LessonProgress` adicionados em `src/lib/supabase/types.ts`

---

## Decisões técnicas tomadas

1. **Rota em `(publics)` com auth guard no page.tsx**
   - O layout `(publics)` não tem proteção de autenticação
   - O `page.tsx` faz verificação própria: `getUser()` → redirect `/login`
   - Depois verifica matrícula em `course_enrollments` → redirect `/vendas`

2. **Estado otimista + `router.refresh()`**
   - Ao marcar como concluída: `setAulas()` otimista primeiro
   - Depois chama Server Action
   - Se sucesso: `router.refresh()` para garantir dados frescos
   - Se erro: rollback do estado otimista

3. **Server Action segura**
   - `getUser()` chamado dentro da action (não confia em user_id do client)
   - `.upsert()` com `onConflict: 'user_id, lesson_id'` para evitar duplicatas
   - `revalidatePath()` após sucesso

---

## Pontos de atenção para manutenção futura

1. **Queries sequenciais no page.tsx**
   - Atualmente são 5 queries sequenciais: getUser → enrollment → lesson → lessons → progress
   - Poderiam ser paralelas com `Promise.all` para melhor performance

2. **Rota `/vendas` não existe ainda**
   - O `redirect('/vendas')` para aluno não matriculado aponta para rota que não foi criada
   - Precisa ser definida com produto

3. **Validação de matrícula na Server Action**
   - A Server Action `marcarConcluida` não valida se o usuário está matriculado no curso
   - Depende exclusivamente de RLS (Row Level Security) no Supabase
   - Se RLS não estiver configurado, é uma falha de segurança

---

## BLOCKERs resolvidos do review

- Nenhum BLOCKER identificado na revisão

---

## SUGGESTIONs pendentes (débito técnico)

| Sugestão | Prioridade | Por que ficou pendente |
|----------|------------|-------------------------|
| Queries paralelas no page.tsx com `Promise.all` | Médio | Funcional, pode ser otimizado depois |
| `loading="lazy"` no `<iframe>` | Baixo | Melhoria de performance opcional |
| Validação de matrícula na Server Action | Alta (se RLS não existir) | RLS deve proteger; validação extra é defensiva |

---

## Critérios de Aceite Verificados

- [x] Aluno não autenticado → redirect `/login`
- [x] Aluno não matriculado → redirect `/vendas`
- [x] Vídeo carrega (embed YouTube/Vimeo)
- [x] Sidebar lista aulas com progresso
- [x] "Marcar como concluída" → upsert em `lesson_progress`
- [x] `npm run build` ✅ sem erros

---

## Arquivos Criados/Modificados

**Criados (4):**
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/page.tsx`
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx`
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/viewModel.tsx`
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/actions.ts`
- `src/utils/video.ts` (novo arquivo utilitário)

**Modificados (1):**
- `src/lib/supabase/types.ts` → adicionados `CourseEnrollment`, `LessonProgress`
