# Contexto: crud-aulas-admin

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.
> Atualizado pelo role que fizer discovery/investigação.

## O que é
CRUD de aulas dentro de um curso no CMS Admin. As aulas são gerenciadas a partir da página de detalhes de um curso (`/cms/dashboard/cursos/[cursoId]`).

## Por que existe
Cursos precisam conter aulas associadas. O admin precisa gerenciar (criar, editar, listar, deletar) aulas vinculadas a um curso com suporte a reordenação.

## Estrutura de Rotas
```
src/app/(cms)/cms/dashboard/cursos/[cursoId]/aulas/
├── page.tsx                          ← listagem de aulas (Server Component)
├── nova/
│   ├── page.tsx                      ← formulário de criação
│   └── _features/NovaAula/
│       ├── view.tsx
│       ├── viewModel.tsx
│       ├── schema.ts
│       └── actions.ts
└── [aulaId]/
│   ├── page.tsx                      ← detalhes + edição da aula
│   └── _features/EditarAula/
│       ├── view.tsx
│       ├── viewModel.tsx
│       ├── schema.ts
│       └── actions.ts
```

## Server Actions
- `criarAula(cursoId, formData)` — insere em `lessons`
- `atualizarAula(aulaId, formData)` — atualiza registro
- `deletarAula(aulaId)` — remove com cascade
- `reordenarAulas(aulaIds[])` — atualiza `position` de múltiplas aulas

## UX na Listagem
- Lista aulas em ordem por `position`
- Drag-and-drop para reordenar (opcional MVP — campos de position editáveis)
- Badge "Publicada" / "Rascunho"

## Critérios de Aceitação
- [ ] Admin consegue criar, editar, deletar e reordenar aulas de um curso
- [ ] Formulário com validação Zod (título obrigatório, URL válida se preenchida)
- [ ] `npm run build` sem erros

## Decisões tomadas
- Padrão MVVM com pasta `_features/<NomeFeature>/` contendo view.tsx, viewModel.tsx, schema.ts e actions.ts
- Server Components para páginas de listagem; Client Components com formulários
- Zod para validação client + server

## O que não fazer
{não definido}
