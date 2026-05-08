# Review Notes — criar-crud-de-cursos-admin

**Data:** 2026-05-08
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 2
- SUGGESTIONs: 1
- QUESTIONs: 0
- PRAISEs: 2

## Comentários

### Camada 1 — Corretude

[BLOCKER] `NovoCurso/actions.ts:52` — revalidatePath com caminho incorreto

`revalidatePath("/cursos")` não afeta a página de listagem que está em `/cms/dashboard/cursos`. Após criar um curso, a listagem pode exibir dados desatualizados (stale cache).

Fix sugerido:
```ts
revalidatePath("/cms/dashboard/cursos");
redirect("/cms/dashboard/cursos");
```

---

[BLOCKER] `EditarCurso/actions.ts:55-56` — revalidatePath com caminhos incorretos

`revalidatePath("/cursos")` e `revalidatePath("/cursos/${slug}")` usam caminhos que não correspondem às rotas reais. O correto é revalidar a listagem em `/cms/dashboard/cursos`.

Fix sugerido:
```ts
revalidatePath("/cms/dashboard/cursos");
redirect("/cms/dashboard/cursos");
```

---

### Camada 2 — Qualidade

[PRAISE] MVVM bem aplicado — view.tsx sem lógica de negócio, viewModel.tsx com lógica pura, schema.ts com Zod, actions.ts server-side. Padrão consistente com a arquitetura e com o restante do projeto.

[PRAISE] TypeScript rigoroso: zero `any`, tipos derivados de Zod via `z.infer`, `type` exclusivamente (nunca `interface`), `cn()` em todo className.

---

### Camada 3 — Acessibilidade

[PRAISE] Labels associados a inputs via `htmlFor`/`id` em todos os campos. Botões e links usam elementos HTML nativos preservando navegabilidade por teclado.

---

### Camada 4 — Manutenibilidade

[SUGGESTION] Inconsistência de padrão entre NovoCurso e EditarCurso

`NovoCurso/viewModel.tsx` usa `form.handleSubmit` + `startTransition` + `FormData` manual, enquanto `EditarCurso/viewModel.tsx` usa `formAction` nativa do `useActionState`. Ambos funcionam, mas a diferença de padrão pode confundir manutenção futura.

Sugestão: padronizar ambos para usar o `formAction` nativo (padrão EditarCurso), delegando a validação RHF antes do submit. Alternativamente, usar `<form action={formAction}>` no JSX e colocar a validação RHF como enhancement via `onSubmit`.

---

## Decisão
**Requer correção dos BLOCKERs** — corrigir revalidatePath antes de prosseguir.
