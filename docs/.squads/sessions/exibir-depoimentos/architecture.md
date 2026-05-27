# Decisão Arquitetural: Exibir Depoimentos de Alunos

**Data:** 2026-05-27
**Agent:** Ana Arquitetura
**Issue:** #14 (sub-task da Epic #6)

---

## Entendimento da Task

Criar o componente `DepoimentosVendas.tsx` — seção de depoimentos de alunos com prova social para a página de vendas `/vendas`. O componente é um Server Component estático com dados hardcoded, sem nenhuma interação com servidor ou estado de cliente.

## Estrutura de Arquivos

```
src/app/(publics)/vendas/
└── _features/vendas/
    └── DepoimentosVendas.tsx   ← único arquivo desta task
```

> **Nota DP-001 (aprovado pelo usuário):** `page.tsx` para `/vendas` não será criado nesta issue (#10 fora do escopo). O componente fica disponível para integração quando a issue #10 for implementada.

## Decisões de Estado

| Dado | Tipo | Justificativa |
|------|------|---------------|
| Lista de depoimentos | Constante local (hardcoded) | Dados estáticos de MVP — sem chamada a servidor necessária |

## Contrato do Componente

```typescript
type Depoimento = {
  id: string
  quote: string
  author: string
  role: string           // ex: "Analista de TI — formado em 2025"
  avatarInitials: string
  resultado?: string     // ex: "Conseguiu emprego em 3 meses"
}

// Componente sem props — dados hardcoded internamente
export function DepoimentosVendas(): JSX.Element
```

## Referência de Design

`TestimonialsSection.tsx` (home) — base de comparação visual:
- Grid `sm:grid-cols-2 lg:grid-cols-3`
- Card: `bg-slate-50 border border-slate-200 rounded-xl p-6`
- Avatar: `size-10 rounded-full bg-teal-700 text-white` com iniciais
- Estrelas: `Star` (lucide-react) com `fill-amber-400 text-amber-400`
- Quote: `italic` em `blockquote`

`DepoimentosVendas` **estende** o padrão com o campo `resultado` — badge ou linha extra abaixo do nome do autor.

## ADR

### ADR-FE-014: Server Component para seção estática de depoimentos

**Contexto:** A issue especifica que os dados são hardcoded e não há interatividade.

**Decisão:** Server Component puro — sem `"use client"`, sem hooks.

**Alternativas rejeitadas:**
- Client Component: desnecessário — sem interação, sem estado de cliente
- Busca do Supabase: fora do escopo do MVP (dados dinâmicos é iteração futura)

**Consequências:**
✅ Renderização no servidor — sem JS extra no cliente
✅ SEO: conteúdo no HTML inicial
⚠ Dados precisam ser atualizados no código para mudar depoimentos (MVP aceitável)

## ADR vigentes respeitados

| ADR | Regra | Como aplicada |
|-----|-------|---------------|
| ADR-001 | App Router, page.tsx = Server Component | Componente é Server Component (sem `"use client"`) |
| ADR-004 | MVVM apenas se há lógica/formulário | Componente estático puro — MVVM não se aplica |
| ADR-005 | Apenas `type`, nunca `interface` | `type Depoimento = {...}` |
| ADR-007 | `cn()` obrigatório em todo `className` | Aplicado em todas as classes |

## Pontos de Atenção para o Dev (Rodrigo React)

1. **Mínimo 3 depoimentos** com `resultado` preenchido e concreto (ex: "Conseguiu promoção em 2 meses")
2. **`resultado` deve ser visualmente destacado** — badge teal ou texto enfatizado abaixo do autor
3. **Stars via loop** — `Array.from({ length: 5 })` com `aria-label="5 estrelas"` no container
4. **`<ul>` com `<li>` + `<article>`** para semântica correta (mesmo padrão da home)
5. **Sem `"use client"`** — componente é Server Component
6. **Export nomeado** — `export function DepoimentosVendas()`
