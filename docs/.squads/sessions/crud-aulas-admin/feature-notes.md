# Feature Notes: crud-aulas-admin

**Data:** 2026-05-09
**Squad:** frontend-001

## O que foi implementado
- CRUD completo de aulas (criar, editar, listar, deletar) vinculadas a um curso no CMS Admin, rota `/cms/dashboard/cursos/[cursoId]/aulas/`
- MVVM Page Architecture com `NovaAula/` e `EditarAula/` features + `_actions/reorder.ts` transversal
- Schema Zod de aula compartilhado entre criação e edição via re-export (`EditarAula/schema.ts` re-exporta `NovaAula/schema.ts`)
- Position auto-assigned na criação via `MAX(position) + 1`; reordenação manual via `reordenarAulas(aulaIds[])`
- Badge "Publicada" / "Rascunho" na listagem com toggle Switch Shadcn no formulário

## Decisões técnicas tomadas
- Schema Zod (`aulaSchema`) definido em `NovaAula/schema.ts` e re-exportado por `EditarAula/schema.ts` — DRY, alterações futuras em um único lugar
- Action de reordenação isolada em `_actions/reorder.ts` (não dentro de `_features/`) por não pertencer a um formulário MVVM específico
- `video_url` validado como `.url().optional().or(z.literal(""))` e convertido para `null` no servidor
- `is_published` como `boolean` + Switch Shadcn em vez de select string enum
- Tabela `lessons` usa `course_id`, `material_url`, `duration_seconds` (sem `description`, `created_by`, `updated_at`) conforme schema ajustado pelo usuário
- Exclusão não reajusta positions automaticamente — admin reordena manualmente após deletar

## Pontos de atenção para manutenção futura
- `revalidatePath` nos server actions deve usar template string com o `cursoId` real, nunca literal `[cursoId]` — o revalidatePath não interpreta parâmetros dinâmicos
- Não usar `generateStaticParams` em páginas de aula (conteúdo dinâmico)
- `cn()` obrigatório em todo className JSX/TSX, importar de `@/lib/utils`
- Usar exclusivamente `type` (nunca `interface`); tipos derivados de schema Zod com `z.infer`
- Navigation: breadcrumb deve levar para `/cms/dashboard/cursos/[cursoId]` (detalhe do curso)

## BLOCKERs resolvidos do review
O review teve 1 BLOCKER: `reorder.ts` usava `revalidatePath("/cms/dashboard/cursos/[cursoId]/aulas")` com `[cursoId]` como literal, não como parâmetro dinâmico — o que fazia a revalidação não funcionar em rotas reais. O usuário optou por **não corrigir** neste momento. **Débito técnico:** adicionar `cursoId` como parâmetro de `reordenarAulas` e usar template string na revalidação.

## SUGGESTIONs pendentes (débito técnico)
1. **Inconsistência de submit entre formulários:** `NovaAula/view.tsx` usa `form.handleSubmit` + `startTransition`; `EditarAula/view.tsx` usa `<form action={formAction}>` diretamente. Padronizar para o mesmo approach.
2. **Updates sequenciais em reorder.ts:** O reorder itera aula por aula com `for...of`, gerando N requisições ao Supabase. Idealmente usar `UPDATE ... SET position = CASE ... END` ou ao menos `Promise.allSettled`.
3. **Erro de query silencioso em AulasPage:** Se a query Supabase falhar, `data` é `null` e o usuário vê "0 aulas encontradas" sem indicação de erro. Adicionar tratamento com log ou Alert.
