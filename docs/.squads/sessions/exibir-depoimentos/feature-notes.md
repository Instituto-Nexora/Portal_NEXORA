# Feature Notes: DepoimentosVendas — Exibir depoimentos de alunos

**Data:** 2026-05-27
**Squad:** frontend-001
**Issue:** #14 (sub-task da Epic #6)

---

## O que foi implementado

- `src/app/(publics)/vendas/_features/vendas/DepoimentosVendas.tsx` — Server Component com seção de depoimentos de alunos para a página `/vendas`
- `type Depoimento` com campos: `id`, `quote`, `author`, `role`, `avatarInitials`, `resultado?`
- 3 depoimentos hardcoded com resultado concreto (contratação, promoção, primeiro emprego)
- Grid responsivo: 1 coluna mobile → `sm:grid-cols-2` → `lg:grid-cols-3`
- Badge de resultado com `ring-inset` e `aria-hidden` no ✓ (acessibilidade)

---

## Decisões técnicas tomadas

- **`page.tsx` de `/vendas` não foi criado** (decisão DP-001 aprovada pelo usuário): escopo da issue #10. O componente fica pronto para integração. O critério "visível em /vendas" será verificável quando a issue #10 for implementada.
- **MVVM não aplicado**: componente estático sem lógica/formulário — ADR-004 não se aplica neste caso (padrão já aprovado em `portal-nexora/memories.md`).
- **Dados hardcoded no mesmo arquivo**: aceitável para o MVP. A extração para `_data/depoimentos.ts` foi sinalizada como débito técnico.

---

## Pontos de atenção para manutenção futura

1. **Para integrar na página de vendas (issue #10):** importar `DepoimentosVendas` de `@/app/(publics)/vendas/_features/vendas/DepoimentosVendas` e adicionar à `page.tsx` sem props.
2. **Quando dados migrarem para Supabase:** o `type Depoimento` já tem `id: string` — os campos batem com uma tabela `testimonials` no banco. Apenas substituir a constante `depoimentos` por uma query Supabase no componente (ou transformar em async Server Component com fetch).
3. **Badge de resultado** usa `ring-inset` (padrão Tailwind v4). Não usar `border` para substituição — o visual de badge ficará diferente.
4. **`avatarInitials` são fixas**: se o aluno tiver nome composto longo, as iniciais precisarão ser definidas manualmente. Não há lógica de derivação automática.

---

## BLOCKERs resolvidos do review

Nenhum blocker encontrado. Review aprovado sem correções obrigatórias.

---

## SUGGESTIONs pendentes (débito técnico)

- **(Baixa)** `✓` no badge tem `aria-hidden` aplicado ✅ (corrigido inline após review)
- **(Baixa)** Extrair `depoimentos` para `_features/vendas/_data/depoimentos.ts` quando o número de depoimentos crescer ou precisar ser compartilhado com outros componentes da página de vendas
