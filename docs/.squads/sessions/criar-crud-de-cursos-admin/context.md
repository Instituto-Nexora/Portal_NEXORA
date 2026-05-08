# Contexto: criar-crud-de-cursos-admin

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.
> Atualizado pelo role que fizer discovery/investigação.

## O que é
CRUD completo de cursos no CMS Admin do Portal Nexora. Permite ao administrador listar, criar, editar e deletar cursos no banco de dados, com toggle de publicação e validação Zod (client + server).

## Por que existe
O Portal Nexora precisa de uma interface administrativa para gestão de cursos, permitindo que administradores mantenham o catálogo de cursos atualizado com controle de conteúdo e publicação.

## Decisões tomadas
- Padrão MVVM com pasta `_features/<NomeFeature>/` contendo view.tsx, viewModel.tsx, schema.ts e actions.ts
- Server Components para páginas de listagem; Client Components com formulários
- Rotas sob `src/app/(cms)/cms/dashboard/cursos/`

## Estrutura de Rotas
```
src/app/(cms)/cms/dashboard/cursos/
├── page.tsx                        ← listagem de cursos (Server Component)
├── novo/
│   ├── page.tsx                    ← formulário de criação
│   └── _features/NovoCurso/
│       ├── view.tsx
│       ├── viewModel.tsx
│       ├── schema.ts
│       └── actions.ts
└── [cursoId]/
    ├── page.tsx                    ← detalhes + edição do curso
    └── _features/EditarCurso/
        ├── view.tsx
        ├── viewModel.tsx
        ├── schema.ts
        └── actions.ts
```

## Critérios de Aceitação
- [ ] Admin consegue listar, criar, editar e deletar cursos
- [ ] Formulário com validação Zod (client + server)
- [ ] Toggle de publicação funciona
- [ ] `npm run build` sem erros

## O que não fazer
{não definido}
