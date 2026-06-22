# Feature Notes — crud-cursos-admin

**Data:** 2026-06-06
**Squad:** frontend-001
**Issue:** #19

---

## O que foi implementado

CRUD completo de cursos no painel CMS (`/cms/dashboard/cursos`), seguindo o padrão MVVM do projeto.

### Rotas criadas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/cms/dashboard/cursos` | `page.tsx` | Listagem com busca, filtro e ações |
| `/cms/dashboard/cursos/novo` | `novo/page.tsx` | Formulário de criação |
| `/cms/dashboard/cursos/[cursoId]/editar` | `[cursoId]/editar/page.tsx` | Formulário de edição |

### Arquivos criados

```
src/app/(cms)/cms/dashboard/cursos/
├── page.tsx
├── _features/CursosCMS/
│   ├── actions.ts        (deletarCurso, togglePublicacao)
│   ├── model.ts          (re-export Curso)
│   ├── view.tsx          (tabela + diálogo de confirmação)
│   └── viewModel.tsx     (filtros + handlers com useTransition)
├── novo/
│   ├── page.tsx
│   └── _features/NovoCurso/
│       ├── actions.ts    (criarCurso → redirect após sucesso)
│       ├── schema.ts     (cursoSchema — fonte única, importada pelo editar)
│       ├── view.tsx      (form com RHF + erros inline)
│       └── viewModel.tsx (useActionState + useForm + startTransition)
└── [cursoId]/editar/
    ├── page.tsx          (busca curso por ID, notFound() se inexistente)
    └── _features/EditarCurso/
        ├── actions.ts    (atualizarCurso → redirect após sucesso)
        ├── view.tsx      (form pré-populado)
        └── viewModel.tsx (useActionState + useForm com defaultValues do curso)
```

### Arquivos modificados

- `src/lib/supabase/types.ts` — Adicionado `type Curso`
- `src/components/cms/Sidebar/SidebarNav.tsx` — Corrigido href "Cursos" para `/cms/dashboard/cursos`

---

## Padrões aplicados

- **MVVM** (ADR-004): `page.tsx` Server Component + `view.tsx` Client + `viewModel.tsx` Client
- **Submit pattern** (igual ao login): `startTransition(() => formAction(formData))` — não `action={formAction}`
- **Server Actions com `createAdminClient()`** — contorna RLS para operações admin
- **Schema compartilhado**: `schema.ts` em `NovoCurso` importado por `EditarCurso` via alias `@/`
- **`revalidatePath`** após toda mutação para invalidar cache do Server Component

---

## Dependências de outras issues

| Issue | Relação |
|-------|---------|
| #18 | Pré-requisito — schema `courses` já existe no Supabase |
| #20 | Depende desta — CRUD de aulas usa `cursoId` como parâmetro de rota |
| #21 | Indiretamente — player precisa de cursos cadastrados |

---

## Notas para futuras implementações

- `price_cents` é armazenado em centavos — considerar exibir/capturar em R$ na próxima revisão de UX
- Upload de thumbnail via Supabase Storage está fora do escopo do #19 (campo aceita URL externa)
- `model.ts` (CursosCMS) apenas re-exporta — pode ser removido em refactor futuro
