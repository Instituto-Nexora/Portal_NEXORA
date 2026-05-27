# Review Notes — DepoimentosVendas (Issue #14)

**Data:** 2026-05-27
**Reviewer:** Renata Revisão
**Arquivo revisado:** `src/app/(publics)/vendas/_features/vendas/DepoimentosVendas.tsx`

---

## Resumo

- BLOCKERs: 0
- SUGGESTIONs: 2
- QUESTIONs: 0
- PRASEs: 5

---

## Verificação de ADRs

| ADR | Status |
|-----|--------|
| ADR-001 (App Router / Server Component) | ✅ RESPEITADA — sem `"use client"`, Server Component puro |
| ADR-004 (MVVM) | ✅ NÃO APLICÁVEL — componente estático sem lógica/formulário |
| ADR-005 (Type-only) | ✅ RESPEITADA — `type Depoimento`, sem nenhum `interface` |
| ADR-007 (cn()) | ✅ RESPEITADA — `cn()` em todo `className` |

---

## Camada 1 — Corretude

- [x] Componente faz o que a spec pede? ✅ Todos os requisitos da issue #14 atendidos.
- [x] Estados async? ✅ N/A — dados hardcoded, componente síncrono.
- [x] Memory leaks? ✅ N/A — Server Component puro, sem efeitos.
- [x] 3 depoimentos com resultado concreto? ✅ Todos têm `resultado` preenchido e factual.

## Camada 2 — Qualidade

- [x] TypeScript sem `any`? ✅
- [x] `type` em vez de `interface`? ✅
- [x] Keys estáveis? ✅ `key={dep.id}` com identificadores únicos (`dep-001`, `dep-002`, `dep-003`).
- [x] Stars com `key={i}`? ✅ Aceitável — lista estática de 5 elementos idênticos. Padrão consistente com `TestimonialsSection.tsx`.

## Camada 3 — Acessibilidade

- [x] `aria-labelledby="depoimentos-vendas-title"` na section? ✅
- [x] Stars com `role="img"` e `aria-label="5 estrelas"`? ✅
- [x] Ícones das estrelas com `aria-hidden="true"`? ✅
- [x] Avatar com `aria-hidden="true"` (decorativo)? ✅
- [x] Conteúdo semântico? ✅ `section > ul > li > article > blockquote > footer`

## Camada 4 — Manutenibilidade

- [x] Nomes descritivos? ✅ `depoimentos`, `dep`, `avatarInitials` — todos claros.
- [x] Sem console.log? ✅
- [x] Sem código comentado? ✅
- [x] Responsabilidade única? ✅

---

## Comentários

---

[SUGGESTION] `DepoimentosVendas.tsx`:31 — Símbolo `✓` no badge de resultado

O símbolo `✓` (U+2713) dentro do `<span>` de resultado é lido por alguns leitores de tela como "checkmark" (em inglês) ou simplesmente ignorado, dependendo do browser/assistive tech. O texto do resultado já é suficientemente descritivo sem o símbolo visual.

Melhoria sugerida: ocultar o símbolo de leitores de tela com `aria-hidden`:
```tsx
<span className={cn("inline-flex w-fit items-center rounded-full bg-teal-50 ...")}>
  <span aria-hidden="true">✓</span>
  {" "}{dep.resultado}
</span>
```

---

[SUGGESTION] `DepoimentosVendas.tsx` — Dados hardcoded sem separação de constante

`depoimentos` é definido no mesmo módulo que o componente. Para o MVP isso é aceitável, mas quando os dados precisarem vir do Supabase, a extração exigirá mudança estrutural no arquivo. Considerar extrair para um arquivo de constantes (`_data/depoimentos.ts`) caso o número de depoimentos cresça ou precise ser compartilhado.

Não bloqueia — débito técnico de baixa prioridade para pós-MVP.

---

[PRAISE] Uso de `article` + `blockquote` + `footer` para semântica de depoimento.

A estrutura semântica está excelente: `article` encapsula cada depoimento como conteúdo independente (sindicável), `blockquote` marca corretamente a citação, `footer` traz o contexto do autor. Isso está além do que a maioria dos devs faz em componentes estáticos — leitores de tela e indexadores entendem perfeitamente a hierarquia.

---

[PRAISE] Badge de `resultado` com `ring-inset` — pattern correto do Tailwind v4.

`ring-1 ring-inset ring-teal-600/20` é o padrão moderno de badge com borda sutil. Consistente com os padrões do projeto e visualmente superior a `border`.

---

[PRAISE] Consistência visual com `TestimonialsSection.tsx`.

Avatar `bg-teal-700`, estrelas `fill-amber-400 text-amber-400`, `role` em `text-teal-600`, `blockquote` italic — todos alinhados com o componente de referência da home. Alguém mantendo o projeto vai reconhecer o padrão imediatamente.

---

[PRAISE] `key={dep.id}` com strings semânticas (`dep-001`, `dep-002`, `dep-003`).

Evitou o anti-pattern de usar index como key, mesmo sendo dados estáticos. Quando os dados migrarem para o Supabase, as keys continuarão estáveis (serão UUIDs reais).

---

[PRAISE] `cn()` aplicado consistentemente em todos os `className`, sem exceção.

ADR-007 seguido à risca — não há um único `className` hardcoded sem `cn()`, incluindo classes estáticas simples.

---

## Decisão

**✅ APROVADO** — 0 BLOCKERs. As 2 SUGGESTIONs são melhorias não-bloqueantes de baixa prioridade.
