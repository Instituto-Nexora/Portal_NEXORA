# Review Notes — crud-aulas-admin

**Data:** 2026-05-09
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 3
- QUESTIONs: 1
- PRAISEs: 4

## Comentários

---

[BLOCKER] `reorder.ts:26` — `revalidatePath` com literal dinâmico

`revalidatePath("/cms/dashboard/cursos/[cursoId]/aulas")` trata `[cursoId]` como literal, não como parâmetro dinâmico. Em Next.js, isso não revalida as rotas dinâmicas reais.

Fix sugerido:
Adicione `cursoId` como parâmetro da função e use template string:
```ts
export async function reordenarAulas(aulaIds: string[], cursoId: string) {
  // ...
  revalidatePath(`/cms/dashboard/cursos/${cursoId}/aulas`);
}
```

---

[SUGGESTION] `EditarAula/view.tsx` vs `NovaAula/view.tsx` — inconsistência de submit

NovaAula usa `form.handleSubmit` + `startTransition`; EditarAula usa `<form action={formAction}>` diretamente. Ambas funcionam, mas criar inconsistência dificulta manutenção futura. Padronizar para o mesmo approach.

---

[SUGGESTION] `reorder.ts` — updates sequenciais em vez de batch

O reorder itera aula por aula com `for...of`, gerando N requisições ao Supabase. Se houver 30 aulas, são 30 chamadas individuais. Considere uma query única com `UPDATE ... SET position = CASE ... END` ou, se o Supabase não suportar, ao menos `Promise.allSettled`.

---

[SUGGESTION] `AulasPage` — erro de query silencioso

Se `adminClient.from("lessons").select(...)` falhar (ex: tabela não existe), `data` será `null` e o usuário vê "0 aulas encontradas" sem indicação de erro. Considere ao menos logar o erro ou mostrar um Alert quando `error` existir.

---

[QUESTION] `DeleteAulaDialog` — redirect assíncrono

`deletarAula` faz `redirect()` dentro de um `startTransition` chamado manualmente (não via form action). O redirect funciona porque o Next.js trata o erro de redirect, mas pode causar comportamento imprevisível se a página já não estiver mais montada. Confirme que isso foi testado.

---

[PRAISE] Schema compartilhado entre criação e edição

Excelente uso de re-export do schema em `EditarAula/schema.ts`. Segue o princípio DRY e garante que os schemas nunca divergem.

---

[PRAISE] Tratamento consistente de erros de validação

Todos os formulários exibem erros tanto do lado client (`errors.field`) quanto do lado server (`state?.errors?.field`). Isso garante feedback imediato + fallback resiliente.

---

[PRAISE] Acessibilidade nos formulários

Todos os inputs têm `<Label htmlFor>` correspondente, mensagens de erro são textuais (não dependem apenas de cor), e o Switch mantém o padrão com hidden input para envio correto do FormData.

---

[PRAISE] MVVM fiel ao padrão

`page.tsx` puramente Server Component, `view.tsx` 0% lógica, `viewModel.tsx` 0% JSX, `schema.ts` e `actions.ts` com responsabilidade única. Exatamente conforme as ADRs do projeto.

## Decisão
Requer correção do BLOCKER antes de prosseguir.
