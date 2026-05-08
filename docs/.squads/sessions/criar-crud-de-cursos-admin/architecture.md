# Decisão Arquitetural: criar-crud-de-cursos-admin

**Data:** 2026-05-08
**Agent:** Ana Arquitetura

## Entendimento da Task

Implementar CRUD completo de cursos no CMS Admin, permitindo que administradores listem, criem, editem e deletem cursos. A feature segue o padrão **MVVM Page Architecture** já consolidado no projeto (eventos, admins), com `page.tsx` Server Component delegando para `_features/{Nome}/view.tsx` + `viewModel.tsx` + `schema.ts` + `actions.ts`. O banco de dados é Supabase (PostgreSQL). A publicação é controlada pelo campo booleano `is_published`.

## Estrutura de Componentes

```
src/app/(cms)/cms/dashboard/cursos/
├── page.tsx                                    ← Server Component: lista cursos, recebe searchParams (status)
├── novo/
│   ├── page.tsx                                ← Server Component: apenas renderiza <NovoCursoView />
│   └── _features/NovoCurso/
│       ├── view.tsx                            ← "use client": formulário Shadcn, zero lógica
│       ├── viewModel.tsx                       ← "use client": useForm + useActionState, nunca JSX
│       ├── schema.ts                           ← Zod schema + z.infer type
│       └── actions.ts                          ← "use server": criarCurso, valida server-side, upload thumbnail
└── [cursoId]/
    ├── page.tsx                                ← Server Component: busca curso por id, passa para view
    └── _features/EditarCurso/
        ├── view.tsx                            ← "use client": formulário preenchido + botão excluir
        ├── viewModel.tsx                       ← "use client": useForm com defaultValues do curso
        ├── schema.ts                           ← Re-export do schema do NovoCurso
        └── actions.ts                          ← "use server": editarCurso + excluirCurso
```

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Listagem de cursos | Server State (fetch Supabase) | Dados frescos a cada request, sem cache cliente |
| Filtro por status | searchParams (URL) | Compartilhável, bookmarked, SSR-friendly |
| Formulário (create/edit) | React Hook Form + useActionState | RHF para controle de formulário; useActionState para estado da Server Action |
| Toggle de publicação | Server Action (`editarCurso`) | Ação atômica que revalida cache e redireciona |
| Exclusão | Server Action (`excluirCurso`) + Dialog de confirmação | Ação destrutiva exige confirmação explícita do usuário |

## Contratos dos Componentes Principais

```ts
// Schema — compartilhado entre criar e editar
type CursoFormData = {
  title: string;
  description: string;
  price_cents?: string;
  is_published: boolean;
};

// Curso — tipo de domínio (banco)
type Curso = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  price_cents: number | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

// CursoEditPage — props recebidas do Server Component
type CursoEditPageProps = {
  params: Promise<{ cursoId: string }>;
};

## ADRs

### ADR-001: Reuso do schema entre criação e edição
O schema de validação (`CursoFormData`) é definido uma única vez em `NovoCurso/schema.ts` e re-exportado por `EditarCurso/schema.ts`. As `defaultValues` da edição são populadas a partir do objeto `Curso` carregado no Server Component, garantindo que ambas as views usem exatamente a mesma validação.

### ADR-002: Thumbnail opcional via upload
Diferente de eventos (onde thumbnail é obrigatória), cursos permitem thumbnail opcional. O input file com name `thumbnail_file` faz upload para Supabase Storage bucket `images` se um arquivo for enviado.

### ADR-003: Estado do formulário via useActionState
Segue o padrão Next.js 16 de Server Actions com `useActionState`, sem chamadas fetch manuais. Isso garante progressive enhancement e tratamento de erro padronizado via `ActionState`.

## Pontos de Atenção para o Dev

1. **Sidebar**: Link de Cursos atualizado para `/cms/dashboard/cursos` em `SidebarNav.tsx`.
2. **Thumbnail**: Input file com `name="thumbnail_file"`. Upload para bucket `images` no Supabase Storage.
3. **Preço**: Armazenado em centavos (`price_cents: number`). Exibir com `Intl.NumberFormat('pt-BR')`.
4. **Revalidação**: `revalidatePath("/cms/dashboard/cursos")` após criar, editar e excluir.
5. **Delete Dialog**: Seguir o padrão `DeleteEventoDialog` — componente separado com confirmação.
6. **Metadata**: `generateMetadata` no `[cursoId]/page.tsx` para SEO.
7. **build**: `npm run build` sem erros — verificar imports, tipos e `cn()` em todo className.
