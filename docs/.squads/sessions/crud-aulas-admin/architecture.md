# Decisão Arquitetural: crud-aulas-admin

**Data:** 2026-05-09
**Agent:** Ana Arquitetura

## Entendimento da Task

Implementar CRUD completo de aulas vinculadas a um curso no CMS Admin, acessível via `/cms/dashboard/cursos/[cursoId]/aulas/`. A feature segue o padrão **MVVM Page Architecture** já consolidado (cursos, eventos, admins), com `page.tsx` Server Component delegando para `_features/{Nome}/view.tsx` + `viewModel.tsx` + `schema.ts` + `actions.ts`. A listagem ordena aulas por `position` e exibe badge de publicação. O banco de dados é Supabase (PostgreSQL). O reordenamento é suportado via bulk update do campo `position`.

## Estrutura de Componentes

```
src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/
├── page.tsx                                    ← Server Component: lista aulas do curso ordenadas por position
├── nova/
│   ├── page.tsx                                ← Server Component: apenas renderiza <NovaAulaView />
│   └── _features/NovaAula/
│       ├── view.tsx                            ← "use client": formulário Shadcn, zero lógica
│       ├── viewModel.tsx                       ← "use client": useForm + useActionState, nunca JSX
│       ├── schema.ts                           ← Zod schema + z.infer type
│       └── actions.ts                          ← "use server": criarAula, valida server-side
└── [aulaId]/
    ├── page.tsx                                ← Server Component: busca aula por id, passa para view
    ├── _features/EditarAula/
    │   ├── view.tsx                            ← "use client": formulário preenchido + botão excluir
    │   ├── viewModel.tsx                       ← "use client": useForm com defaultValues da aula
    │   ├── schema.ts                           ← Re-export do schema da NovaAula
    │   └── actions.ts                          ← "use server": atualizarAula + deletarAula
    └── _features/DeleteAulaDialog/
        └── view.tsx                            ← "use client": confirmação inline com useTransition (reusar padrão DeleteEventoDialog)
```

### Ações transversais

```
src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/
└── _actions/
    └── reorder.ts                              ← "use server": reordenarAulas(aulaIds[]), usado pelo drag-and-drop da listagem
```

## Schema do Banco de Dados (Supabase)

```sql
create table public.lessons (
  id                uuid primary key default gen_random_uuid(),
  course_id         uuid not null references public.cursos(id) on delete cascade,
  title             text not null,
  video_url         text,
  material_url      text,
  position          integer not null default 0,
  duration_seconds  integer,
  is_published      boolean not null default false,
  created_at        timestamptz not null default now()
);

-- Índice para ordenação por posição dentro de um curso
create index idx_lessons_course_position on public.lessons(course_id, position);

-- RLS: leitura pública para published; escrita só para autenticados (admin/professor)
alter table public.lessons enable row level security;

create policy "lessons_public_read"
  on public.lessons for select
  using (is_published = true);

create policy "lessons_cms_write"
  on public.lessons for all
  using (auth.role() = 'authenticated');
```

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Listagem de aulas | Server State (fetch Supabase) | Dados frescos a cada request, filtrados por `cursoId`, ordenados por `position` |
| Formulário (create/edit) | React Hook Form + useActionState | RHF para controle de formulário; useActionState para estado da Server Action (padrão Next.js 16) |
| Reordenação | Server Action (`reordenarAulas`) + client-side optimistic update (opcional) | Bulk update atômico de múltiplas posições; drag-and-drop requer feedback imediato |
| Exclusão | Server Action (`deletarAula`) + Dialog de confirmação | Ação destrutiva exige confirmação explícita do usuário |

## Contratos dos Componentes Principais

```ts
// Schema — compartilhado entre criar e editar
type AulaFormData = {
  title: string;
  description?: string;
  video_url?: string;
  is_published: boolean;
};

// Aula — tipo de domínio (banco)
type Aula = {
  id: string;
  curso_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  position: number;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// AulasListPage — props recebidas do Server Component de listagem
type AulasListPageProps = {
  params: Promise<{ cursoId: string }>;
};

// AulaEditPage — props recebidas do Server Component de edição
type AulaEditPageProps = {
  params: Promise<{ cursoId: string; aulaId: string }>;
};

// NovaAulaView — props recebidas da viewModel
type NovaAulaViewProps = {
  state: ActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
};

// EditarAulaView — props recebidas da viewModel
type EditarAulaViewProps = {
  aula: Aula;
  state: ActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
};

// AulasListView — props recebidas pelo componente de listagem
type AulasListViewProps = {
  aulas: Aula[];
  cursoId: string;
};

// DeleteAulaDialog — props
type DeleteAulaDialogProps = {
  aulaId: string;
  cursoId: string;
  aulaTitle: string;
};
```

## ADRs

### ADR-001: Position auto-assigned on creation
**Contexto:** A tabela `lessons` exige `position` para ordenação. O admin não deve precisar informar manualmente a posição ao criar uma aula.
**Decisão:** A Server Action `criarAula` consulta o `MAX(position)` das aulas do mesmo curso e atribui `position + 1`. Na edição, o campo `position` não é exibido no formulário — a posição é gerenciada exclusivamente via reordenação.
**Alternativas rejeitadas:** Campo `position` manual no formulário — propenso a erro e conflitos.
**Consequências:** A ordenação inicial segue a ordem de criação. Reordenação posterior via `reordenarAulas` ou drag-and-drop.

### ADR-002: Schema compartilhado entre criação e edição
**Contexto:** Os schemas de criação e edição de aula são idênticos (mesmos campos, mesmas regras de validação).
**Decisão:** O schema Zod (`aulaSchema`) é definido uma única vez em `NovaAula/schema.ts` e re-exportado por `EditarAula/schema.ts`. As `defaultValues` da edição são populadas a partir do objeto `Aula` carregado no Server Component.
**Alternativas rejeitadas:** Schema duplicado — viola DRY e pode divergir.
**Consequências:** Qualquer alteração no schema é feita em um único lugar.

### ADR-003: Actions de reordenação em pasta compartilhada `_actions/`
**Contexto:** A função `reordenarAulas(aulaIds[])` é chamada a partir da listagem (`page.tsx`), não do formulário de criação ou edição. Não pertence a uma feature MVVM específica.
**Decisão:** A Server Action de reordenação fica em `_actions/reorder.ts` no mesmo nível da pasta `aulas/`, e não dentro de `_features/NovaAula/` ou `_features/EditarAula/`.
**Alternativas rejeitadas:** Colocar em `_features/EditarAula/actions.ts` — semanticamente incorreto pois não é ação de formulário. Criar um `_features/AulasList/` — adicionaria complexidade desnecessária para uma listagem Server Component pura.
**Consequências:** A listagem (`page.tsx`) importa `reordenarAulas` de `./_actions/reorder`. O import é limpo e a action fica agrupada com outras actions transversais.

### ADR-004: `video_url` validado como URL opcional
**Contexto:** Aulas podem conter vídeo (YouTube, Vimeo, etc.), mas o campo é opcional.
**Decisão:** O schema valida `video_url` com `.url("URL inválida")` apenas se preenchido (`z.string().url().optional().or(z.literal(""))`). O server action converte string vazia para `null` no banco.
**Alternativas rejeitadas:** Campo obrigatório — aulas podem ser apenas texto/PDF.
**Consequências:** Input type `url` no formulário; validação client + server idêntica.

### ADR-005: `is_published` como boolean no formulário (toggle switch)
**Contexto:** A listagem exibe badge "Publicada" / "Rascunho". O formulário precisa de toggle para publicar/despublicar.
**Decisão:** Campo `is_published` do tipo `boolean` no schema, renderizado como `<Switch />` (Shadcn) no formulário. O badge na listagem lê `is_published` diretamente.
**Alternativas rejeitadas:** Select com "draft"/"published" — string enum adiciona complexidade desnecessária para um binário.
**Consequências:** Toggle Shadcn com label "Publicada". Valor padrão `false` no formulário de criação.

## Pontos de Atenção para o Dev

1. **Revalidação**: `revalidatePath("/cms/dashboard/cursos/[cursoId]/aulas")` após criar, editar, deletar e reordenar. A rota `/cms/dashboard/cursos` também deve ser revalidada se o número de aulas for exibido no card do curso.

2. **Posição após exclusão**: Ao deletar uma aula, as posições das aulas seguintes **não** são reajustadas automaticamente — é intencional para evitar reescrita em massa. O admin pode reordenar manualmente após exclusão.

3. **Reorder — implementação**: `reordenarAulas(aulaIds[])` no MVP pode ser implementado com campos de input numérico ao lado de cada aula na listagem, permitindo editar a posição inline e submeter o bulk. Drag-and-drop com `@dnd-kit/core` fica para pós-MVP.

4. **Navegação**: O breadcrumb ou link de volta deve levar para `/cms/dashboard/cursos/[cursoId]` (detalhe do curso), não para a listagem geral de cursos.

5. **Sidebar**: Não é necessário novo link na sidebar — aulas são acessadas via detalhe do curso. Mas o link do curso na listagem de cursos (`/cms/dashboard/cursos`) deve levar para `/cms/dashboard/cursos/[cursoId]` se existir, ou para `/cms/dashboard/cursos/[cursoId]/aulas` (decidir com produto).

6. **Delete Dialog**: Seguir o padrão `DeleteEventoDialog` — componente separado `DeleteAulaDialog/view.tsx` com `useTransition` e confirmação textual (ex: "Tem certeza que deseja excluir a aula \"{title}\"?").

7. **Metadata**: `generateMetadata` em `[aulaId]/page.tsx` e `nova/page.tsx` para título de aba descritivo. `generateStaticParams` **não** deve ser usado (conteúdo dinâmico).

8. **cn()**: Obrigatório em todo `className` JSX/TSX — importar de `@/lib/utils`.

9. **Type-only**: Usar exclusivamente `type` (nunca `interface`). Tipos derivados de schema Zod com `z.infer<typeof aulaSchema>`.

10. **build**: `npm run build` sem erros — verificar imports, tipos e `cn()`.
