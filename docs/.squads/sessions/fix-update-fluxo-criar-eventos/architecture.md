# Decisão Arquitetural: Player de Vídeo — Área do Aluno

**Data:** 2026-05-12
**Agent:** Ana Arquitetura

## Entendimento da Task

Construir o player de vídeo para aulas na área do aluno, permitindo que alunos matriculados assistam aulas gravadas (embed YouTube/Vimeo), naveguem entre aulas do curso via sidebar com indicador de progresso, e marquem cada aula como concluída. A rota segue o padrão MVVM do projeto com `page.tsx` (Server Component) fazendo verificação de matrícula e passando dados para `_features/PlayerAula/`.

## Estrutura de Arquivos

```
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/
├── page.tsx                                      ← Server Component: autenticação + matrícula + fetch aula/curso/aulas
└── _features/PlayerAula/
    ├── view.tsx                                  ← "use client": layout player (2 colunas: vídeo + sidebar)
    ├── viewModel.tsx                             ← "use client": seleção de aula ativa, progresso local, navegação
    └── actions.ts                                ← "use server": marcarConcluida + revalidatePath
```

> **MVVM:** `page.tsx` = Server Component (sem `"use client"`, sem hooks). `_features/PlayerAula/view.tsx` = só JSX com Shadcn. `viewModel.tsx` = lógica pura, sem JSX. `actions.ts` = Server Actions. Schema Zod não é necessário (não há formulário).

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Aula atual (dados) | Server State (fetch page.tsx) | Server Component busca `aula` por `aulaId` — dado imutável na navegação |
| Lista de aulas do curso | Server State (fetch page.tsx) | Server Component busca todas aulas do curso + progressos do aluno em uma query |
| Aula ativa na sidebar | useState (viewModel) | Estado local: qual aula está selecionada/ativa visualmente |
| Progresso concluído | useState (viewModel) + Server Action | Estado local otimista ao marcar, confirmado após Server Action bem-sucedida |
| Navegação entre aulas | `router.push()` via viewModel | Transição de página via Next.js router (recarrega Server Component) |

### Fluxo de dados

```
page.tsx (Server Component)
  │
  ├── createClient() → supabase.auth.getUser() → redirect /login se não autenticado
  ├── query enrollment → redirect /vendas se não matriculado
  ├── query lesson by aulaId + courseId → 404 se não encontrada
  ├── query all course lessons + progress → aulas[]
  │
  └── render <PlayerAulaView aula={data} aulas={aulas} />
                                        │
                          viewModel.tsx (usePlayerAulaViewModel)
                            ├── aula ativa, progresso local
                            ├── marcarConcluida() → actions.ts
                            └── handleNavegar(nextAulaId) → router.push()
```

## Contratos dos Componentes Principais

```ts
// page.tsx — Server Component
type PlayerAulaPageProps = {
  params: Promise<{ cursoId: string; aulaId: string }>;
};

// view.tsx — Client Component layout
type PlayerAulaViewProps = {
  aula: AulaData;
  aulas: AulaComProgresso[];
};

// viewModel.tsx — hook retornado para a view
type PlayerAulaViewModel = {
  aulaAtiva: AulaComProgresso;
  aulas: AulaComProgresso[];
  isPending: boolean;
  marcarConcluida: () => void;
  handleNavegar: (aulaId: string) => void;
};

// actions.ts — Server Actions
type MarcarConcluidaAction = (
  aulaId: string,
) => Promise<ActionState>;

// Tipos de domínio (derivados de Lesson + progress)
type AulaData = Lesson;

type AulaComProgresso = Lesson & {
  concluida: boolean;
};
```

## Esquemas do Banco de Dados (Supabase)

### `course_enrollments` (novo — verificação de matrícula)

```sql
create table public.course_enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references public.cursos(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, course_id)
);
```

### `lesson_progress` (novo — progresso do aluno)

```sql
create table public.lesson_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  completed   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, lesson_id)
);
```

> **Upsert:** A Server Action `marcarConcluida` usa `.upsert()` com `onConflict: 'user_id, lesson_id'` para evitar duplicatas em múltiplos cliques.

## ADRs

### ADR-001: Rota em `(publics)` com autenticação auto-gerida
**Contexto:** A rota `minha-area` atualmente existe em `(private)` (layout com auth guard automático). O usuário definiu a rota do player como `(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]`. O layout `(publics)` não tem proteção de rota.
**Decisão:** Manter a rota em `(publics)` conforme especificado. O `page.tsx` do player é responsável por verificar autenticação (`supabase.auth.getUser()`) e matrícula (`course_enrollments`) e redirecionar quando necessário. Isso mantém a flexibilidade de layouts diferentes para a área do aluno vs. player.
**Alternativas rejeitadas:** Mover para `(private)` — inconsistente com a especificação. Mover toda `minha-area` para `(publics)` — fora do escopo, impactaria a página atual de listagem de cursos.
**Consequências:** ✅ Page.tsx precisa de código extra de guarda (auth + matrícula). ⚠ O layout Header/Footer do `(publics)` será exibido (desejável? confirmar com produto).

### ADR-002: Server Action usa `createClient()` (auth context do aluno)
**Contexto:** A Server Action `marcarConcluida` precisa registrar progresso associado ao `user_id` do aluno logado.
**Decisão:** Usar `createClient()` de `@/lib/supabase/server` (RLS auth context), NÃO `createAdminClient()`. A query usa `.upsert()` com `user_id` extraído via `supabase.auth.getUser()` dentro da Server Action. A tabela `lesson_progress` tem RLS que permite INSERT/UPDATE apenas para o próprio usuário.
**Alternativas rejeitadas:** `createAdminClient()` — bypassaria RLS e permitiria que um aluno marcasse progresso para outro. `userId` vindo do client — inseguro (pode ser adulterado).
**Consequências:** ✅ Segurança via RLS respeitada. ✅ Pattern consistente com outras Server Actions do projeto.

### ADR-003: Navegação entre aulas via `router.push()` (hard navigation)
**Contexto:** Ao clicar em outra aula na sidebar, o player precisa trocar de aula.
**Decisão:** Usar `router.push()` para navegar para `[aulaId]` da aula selecionada. Isso recarrega o Server Component, garantindo dados atualizados (aula, progresso). A viewModel gerencia estado local apenas para feedback visual imediato (progresso otimista, aula ativa).
**Alternativas rejeitadas:** Trocar aula via estado local — complexo (precisaria recarregar embed, sincronizar progresso, etc.) e viola o princípio de que `page.tsx` é Server Component. Trocar via `useTransition` — possível, mas adiciona complexidade desnecessária no MVP.
**Consequências:** ✅ Dados sempre frescos após navegação. ⚠ Transição de página completa (leve latência). Melhorias de UX (prefetch, transição suave) podem ser adicionadas pós-MVP.

### ADR-004: Video ID extraído via função utilitária
**Contexto:** A URL de vídeo armazenada no banco pode ser do YouTube ou Vimeo. O embed precisa apenas do ID do vídeo.
**Decisão:** Criar função pura `extractVideoId(url: string): { platform: 'youtube' | 'vimeo'; id: string } | null` que parseia a URL e extrai o ID. Se a URL for inválida ou plataforma não suportada, retorna `null` e a view renderiza placeholder "Vídeo indisponível".
**Locais suportados:** `youtube.com/watch?v=`, `youtu.be/`, `youtube.com/embed/`, `vimeo.com/`.
**Alternativas rejeitadas:** Assumir que `video_url` já é embed URL — frágil. Armazenar plataforma + ID separadamente — mudança de schema que impactaria o CMS admin.
**Consequências:** ✅ Função testável e isolada. ✅ Sem migrations. ⚠ Se nova plataforma for adicionada, função precisa ser atualizada.

## Pontos de Atenção para o Dev

1. **Auth check duplicado**: O layout `(publics)` não tem guarda de autenticação. O `page.tsx` deve verificar `supabase.auth.getUser()` e redirecionar para `/login` se não autenticado — antes da query de matrícula.

2. **Matrícula**: A query de enrollment usa `course_enrollments` com `user_id` + `course_id`. Se não existir → `redirect('/vendas')`. A rota `/vendas` não existe ainda — confirmar destino com produto.

3. **Query otimizada**: No `page.tsx`, buscar aulas do curso + progressos do aluno em uma única query (ou duas paralelas) para evitar N+1:
   ```ts
   const { data: aulas } = await supabase
     .from("lessons")
     .select("*, lesson_progress!left(completed)")
     .eq("course_id", cursoId)
     .eq("lesson_progress.user_id", userId)
     .order("position", { ascending: true });
   ```

4. **Revalidate após marcar concluída**: `revalidatePath()` deve invalidar a rota atual (`/minha-area/cursos/${cursoId}/aulas/${aulaId}`) para que a sidebar exiba o progresso atualizado.

5. **Aula seguinte**: Extrair a aula com `position` imediatamente superior à atual. Se não houver (última aula), exibir "Parabéns — curso concluído!".

6. **Material complementar**: Se `material_url` existir, renderizar link de download/acesso abaixo do player (fora do escopo principal, mas é simples incluir).

7. **cn()**: Obrigatório em todo `className` JSX/TSX — importar de `@/lib/utils`.

8. **Type-only**: Usar exclusivamente `type` (nunca `interface`). Nenhum schema Zod necessário — não há formulário.

9. **Metadata**: `generateMetadata` no `page.tsx` para título dinâmico com nome da aula + curso.

10. **build**: `npm run build` sem erros — verificar imports, tipos e `cn()`.

## Arquivos a Modificar/Criar (SCOPE GUARD)

```
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/page.tsx       ← CRIAR
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx    ← CRIAR
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/viewModel.tsx ← CRIAR
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/actions.ts   ← CRIAR
src/lib/supabase/types.ts     ← MODIFICAR (adicionar CourseEnrollment, LessonProgress types)
```

