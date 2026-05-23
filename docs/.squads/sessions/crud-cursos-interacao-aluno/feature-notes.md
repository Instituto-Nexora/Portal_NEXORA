# Feature Notes: Minha Área — Cursos do Aluno

**Data:** 2026-05-15
**Squad:** frontend-001

## O que foi implementado
- Refatoração completa de `src/app/(private)/minha-area/page.tsx` — de 170 linhas monolíticas para 32 linhas seguindo MVVM (Server-First)
- Criação de `src/_features/minha-area/` com estrutura MVVM: view.tsx, viewModel.tsx, hooks/, types/, components/
- Componentes extraídos: CourseCard (com barra de progresso acessível), CourseCardSkeleton, EmptyState
- loading.tsx com 6 skeletons replicando o layout do grid
- error.tsx com mensagem amigável e botão "Tentar novamente"
- N+1 de progresso eliminado: queries em batch (enrollments → courses → lessons → progress)

## Decisões técnicas tomadas
- **Server-First MVVM:** ViewModel postergado — `viewModel.tsx` existe como hook exportado mas sem implementação até haver interatividade cliente (filtro/sort futuro). Evita over-engineering.
- **`_features/` como diretório de colocation:** Primeira feature do projeto a usar o padrão. Nome em kebab-case, sem plural.
- **Progresso calculado inline (fallback):** ADR-002 recomenda trigger DB, mas como o trigger pode não existir, o cálculo via batch queries é o fallback pragmático. Criar trigger Postgres é tarefa futura.

## Pontos de atenção para manutenção futura
- `_features/` não existia antes — agora é o padrão para features. Manter consistência.
- `course_enrollments.progress_percent` — verificar se trigger Postgres existe. Se não, migrar quando disponível.
- CourseCard usa `nativeButton={false}` com `render={<Link />}` — funciona em Server Component porque o Shadcn Button com `nativeButton={false}` não é um `<button>` nativo e sim um wrapper que aceita `render`. Confirmar compatibilidade com Next.js 16.

## BLOCKERs resolvidos do review
- **BLOCKER:** Ausência de error handling nas queries Supabase → criado `error.tsx` no diretório da rota

## SUGGESTIONs pendentes (débito técnico)
- **Extrair lógica de montagem dos cursos:** A função que monta `CursoComProgresso[]` em page.tsx poderia ser movida para `minha-area.utils.ts` ou `use-minha-area.ts` — postergado para manter escopo da refatoração focado
- **Migrar para leitura direta de `progress_percent`:** Requer trigger Postgres — tarefa separada
