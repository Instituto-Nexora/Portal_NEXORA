# Decisão Arquitetural: crud-cursos-admin

**Data:** 2026-06-06
**Agent:** Ana Arquitetura (frontend-001)

---

## Entendimento da Task

Implementar o módulo de gestão de cursos no painel CMS (`/cms/dashboard/cursos`).
Administradores podem listar cursos com filtros, criar novos, editar existentes, remover e alternar o status de publicação.
É pré-requisito para issues #20, #21, #23 e #25.

---

## Estrutura de Arquivos

```
src/app/(cms)/cms/dashboard/cursos/
├── page.tsx                                   ← Server Component — busca lista de cursos
├── _features/
│   └── CursosCMS/
│       ├── actions.ts                         ← Server Actions: deletarCurso, togglePublicacao
│       ├── model.ts                           ← type Curso (lista)
│       ├── view.tsx                           ← "use client" — tabela + filtros + botões
│       └── viewModel.tsx                      ← "use client" — estado de filtro + handlers
├── novo/
│   ├── page.tsx                               ← Server Component
│   └── _features/
│       └── NovoCurso/
│           ├── actions.ts                     ← Server Action: criarCurso
│           ├── schema.ts                      ← Zod schema (fonte única — editar importa daqui)
│           ├── view.tsx                       ← "use client" — form UI
│           └── viewModel.tsx                  ← "use client" — RHF + submit logic
└── [cursoId]/
    └── editar/
        ├── page.tsx                           ← Server Component — busca curso por ID
        └── _features/
            └── EditarCurso/
                ├── actions.ts                 ← Server Actions: atualizarCurso
                ├── view.tsx                   ← "use client" — form UI (mesmo layout do novo)
                └── viewModel.tsx              ← "use client" — RHF com valores iniciais
```

---

## Arquivos a modificar/criar

- `src/app/(cms)/cms/dashboard/cursos/page.tsx`
- `src/app/(cms)/cms/dashboard/cursos/_features/CursosCMS/actions.ts`
- `src/app/(cms)/cms/dashboard/cursos/_features/CursosCMS/model.ts`
- `src/app/(cms)/cms/dashboard/cursos/_features/CursosCMS/view.tsx`
- `src/app/(cms)/cms/dashboard/cursos/_features/CursosCMS/viewModel.tsx`
- `src/app/(cms)/cms/dashboard/cursos/novo/page.tsx`
- `src/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/actions.ts`
- `src/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/schema.ts`
- `src/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/view.tsx`
- `src/app/(cms)/cms/dashboard/cursos/novo/_features/NovoCurso/viewModel.tsx`
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/editar/page.tsx`
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/editar/_features/EditarCurso/actions.ts`
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/editar/_features/EditarCurso/view.tsx`
- `src/app/(cms)/cms/dashboard/cursos/[cursoId]/editar/_features/EditarCurso/viewModel.tsx`
- `src/lib/supabase/types.ts` (adicionar type Curso + CursoStatus)
- `src/components/layout/PrivateSidebar/PrivateSidebarNav.tsx` (adicionar link Cursos)

---

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Lista de cursos | Server Component (prop) | Dados iniciais buscados no servidor, passados como prop |
| Filtro de busca | useState (local) | Estado de UI sem compartilhamento |
| Filtro de status | useState (local) | Estado de UI sem compartilhamento |
| Form data (create/edit) | React Hook Form | ADR-004: obrigatório para formulários |
| Toast de feedback | Sonner (useToast) | Feedback visual de ações destrutivas |

---

## Contratos dos Componentes Principais

```typescript
// CursosCMSView — lista de cursos
type CursosCMSViewProps = {
  initialCursos: Curso[]
}

// NovoCursoView / EditarCursoView — form
type CursoFormViewProps = {
  curso?: Curso          // undefined = criação | objeto = edição
}

// Zod schema (fonte única em novo/_features/NovoCurso/schema.ts)
const cursoSchema = z.object({
  title: z.string().min(3, "Título obrigatório"),
  description: z.string().optional(),
  thumbnail_url: z.string().url("URL inválida").optional().or(z.literal("")),
  price_cents: z.coerce.number().int().min(0, "Preço inválido"),
  is_published: z.boolean().default(false),
})
type CursoFormData = z.infer<typeof cursoSchema>
```

---

## Componentes Shadcn/UI a usar

| Necessidade | Componente |
|-------------|-----------|
| Listagem | `Table`, `TableRow`, `TableCell`, `TableHead` |
| Badges de status | `Badge` |
| Botões de ação | `Button` |
| Busca/filtro | `Input`, `Select` |
| Form fields | `Input`, `Textarea`, `Label`, `Switch` (toggle publicação) |
| Feedback de ação | `toast` (Sonner) |
| Confirmação de exclusão | `AlertDialog` |
| Form wrapper | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage` (Shadcn Form) |

---

## ADR-FE-023: Rota de edição separada da criação

**Contexto:** Para o CRUD de cursos, poderíamos usar uma única rota com form compartilhado (criação e edição no mesmo componente) ou rotas separadas.

**Decisão:** Rotas separadas (`/novo` e `/[cursoId]/editar`) com ViewModels distintos. O Zod schema é compartilhado via importação direta.

**Alternativas rejeitadas:**
- Form compartilhado em modal: rejeitado — viola ADR-004 (MVVM por página), forms em modais dificultam validação e URL-driven navigation
- Uma única rota com query param `?mode=edit`: rejeitado — URL não legível, Server Component não pode derivar modo de query param de forma limpa

**Consequências:**
✅ Cada página tem responsabilidade única e URL navegável
✅ Server Component da edição pode buscar o curso diretamente por `cursoId`
⚠ Dois ViewModels quase idênticos (mitigado pelo schema compartilhado)

---

## Pontos de Atenção para o Dev

1. **`createAdminClient()` apenas em `"use server"`** — jamais importar no cliente
2. **`price_cents`**: valor em centavos no banco. No form, exibir em reais (`price_cents / 100`) e converter ao salvar (`value * 100`). Usar `z.coerce.number()` para tratar input como número
3. **`thumbnail_url`**: campo opcional — validar URL apenas se preenchido (`.optional().or(z.literal(""))`)
4. **Delete**: usar `AlertDialog` para confirmação antes de executar a Server Action
5. **Toggle publicação**: `Switch` Shadcn + Server Action `togglePublicacao` — `revalidatePath` após mutação
6. **Adicionar link "Cursos"** no `PrivateSidebarNav` (CMS sidebar) com ícone `BookOpen` do lucide-react
7. **`revalidatePath("/cms/dashboard/cursos")`** após toda mutação para invalidar cache do Server Component
