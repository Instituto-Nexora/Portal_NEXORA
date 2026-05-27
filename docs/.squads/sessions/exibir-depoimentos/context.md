# Context: exibir-depoimentos

**Squad:** frontend-001
**Feature:** Exibir depoimentos de alunos na página de vendas
**Issue:** #14 (sub-task da Epic #6)
**Dependência contextual:** Issue #10 (página `/vendas`) — não implementada nesta task
**Branch:** feat/exibir-depoimentos
**Data de início:** 2026-05-27

## Objetivo

Criar o componente `DepoimentosVendas.tsx` com seção de depoimentos de alunos para a página de vendas `/vendas`.

## Escopo da Issue #14

- Criar `src/app/(publics)/vendas/_features/vendas/DepoimentosVendas.tsx`
- Mínimo 3 depoimentos com resultado concreto
- Grid responsivo (2-3 col desktop, empilhado mobile)
- Cards com avatar (iniciais), citação em itálico, nome, contexto, 5 estrelas amber
- Server Component com dados hardcoded
- Visual consistente com `TestimonialsSection.tsx` (home)

## Fora do Escopo (issue #10 — não implementar)

- `HeroVendas.tsx`, `ConteudoProgramatico.tsx`, `Certificado.tsx`, `CheckoutCTA.tsx`
- Página completa de vendas com todas as seções

## Notas técnicas

- `TestimonialsSection.tsx` (home) é referência de design — reutilizar padrão visual
- `type Depoimento` inclui campo `resultado?: string` (diferença da home)
- Estrelas: `fill-amber-400 text-amber-400` (Star de lucide-react)
- `cn()` obrigatório em todo `className` (ADR-007)
- Apenas `type`, nunca `interface` (ADR-005)
