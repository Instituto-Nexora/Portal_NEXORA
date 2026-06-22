# Review Notes — crud-cursos-admin

**Data:** 2026-06-06
**Reviewer:** Renata Revisão (frontend-001)

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 3
- QUESTIONs: 0
- PRASEs: 4

## Comentários

---

[BLOCKER] novo/_features/NovoCurso/view.tsx + viewModel.tsx (padrão replicado em EditarCurso)

O form usa `action={formAction}` diretamente, o que passa o FormData nativo para a Server Action sem
passar pelo `handleSubmit` do React Hook Form. Resultado: a validação client-side do RHF **nunca
roda no evento de submit** — erros só aparecem em blur/change, nunca na tentativa de envio.

O codebase já tem o padrão correto implementado em `(auth)/login/_features/login/viewModel.tsx`:
- `onSubmit` handler cria FormData manualmente a partir dos dados validados pelo RHF
- `startTransition(() => formAction(formData))` garante que `isPending` seja capturado corretamente
- Form usa `onSubmit={form.handleSubmit(onSubmit)}` — não `action={...}`

Fix sugerido (ViewModel):
```typescript
const onSubmit: SubmitHandler<CursoFormData> = (data) => {
  const formData = new FormData()
  formData.append("title", data.title)
  formData.append("description", data.description ?? "")
  formData.append("thumbnail_url", data.thumbnail_url ?? "")
  formData.append("price_cents", String(data.price_cents))
  formData.append("is_published", String(data.is_published))
  startTransition(() => formAction(formData))
}
// retornar { form, onSubmit, state, isPending }
```

Fix sugerido (View):
```tsx
<form onSubmit={form.handleSubmit(onSubmit)} ...>
  {/* remover: action={formAction} */}
  {/* remover: <input type="hidden" name="is_published" ...> */}
```

---

[SUGGESTION] viewModel.tsx (CursosCMS) — optimistic update sem rollback

`handleTogglePublicacao` e `handleConfirmarDeletar` atualizam o estado local com `setCursos`
antes da ação completar, mas não revertem em caso de erro — o toast mostra o erro mas o estado
local fica inconsistente (ex: curso aparece como publicado mas falhou no servidor).

Melhoria: guardar o estado anterior e reverter em caso de erro:
```typescript
const prev = cursos
setCursos(/* update */)
try { await action() }
catch { setCursos(prev); toast.error("...") }
```

---

[SUGGESTION] cursos/_features/CursosCMS/model.ts

Arquivo que apenas re-exporta um tipo de outro módulo gera complexidade desnecessária.
Importar `Curso` diretamente de `@/lib/supabase/types` nos arquivos que precisam é mais simples.

---

[SUGGESTION] view.tsx (NovoCurso e EditarCurso) — preço em centavos como UX ruim

A dica "Informe em centavos. Ex: R$ 97,00 = 9700" é confusa para um painel admin.
Considerar exibir e capturar o valor em reais (com conversão para centavos na submissão):
- Input do usuário: `97.00`
- Conversão no onSubmit: `Math.round(parseFloat(value) * 100)`
- Isso é uma decisão de produto — sinalizado para refinamento futuro.

---

[PRAISE] view.tsx (CursosCMS)

Excelente uso de `aria-label` em todos os botões de ação da tabela
(`"Editar curso X"`, `"Remover curso X"`, `"Publicar/Despublicar curso X"`).
Padrão de acessibilidade correto para ações em linhas de tabela.

---

[PRAISE] viewModel.tsx (CursosCMS)

Uso correto de `useTransition` para capturar o `isPending` durante Server Actions assíncronas.
`startTransition` é o padrão correto para não bloquear a UI durante mutations.

---

[PRAISE] page.tsx (cursos, novo, editar)

Todos os `page.tsx` são Server Components puros, sem hooks, sem `"use client"`.
ADR-001 e ADR-004 respeitadas.

---

[PRAISE] schema.ts — NovoCurso

Boa separação: schema como fonte única de verdade (importado pelo EditarCurso via `@/` alias).
`z.string().url().optional().or(z.literal(""))` é o padrão correto para campos URL opcionais.

---

## ADRs verificadas

- [RESPEITADA] ADR-001: page.tsx sem "use client", sem hooks
- [RESPEITADA] ADR-002: createAdminClient() apenas em "use server"
- [RESPEITADA] ADR-004: MVVM em todas as páginas
- [RESPEITADA] ADR-005: zero `interface` — apenas `type`
- [RESPEITADA] ADR-006: sem duplicação de lógica
- [RESPEITADA] ADR-007: cn() em todos os className
- [RESPEITADA] ADR-009: Shadcn Button, Input, Textarea, Label, Table, Badge, Dialog, Select

## Decisão

**Requer correção do BLOCKER** — corrigir padrão de submit nos forms antes de prosseguir.
