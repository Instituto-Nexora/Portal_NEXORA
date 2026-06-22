# Review Notes: pagina-detalhe-curso

> Notas de revisão de todos os roles. Append-only.

## Review — 2026-06-18 (Renata Revisão FE)

**Resumo:** BLOCKERs: 0 · SUGGESTIONs: 4 · QUESTIONs: 1 · PRASEs: 3

### [SUGGESTION] `page.tsx` — query duplicada em `generateMetadata`

`generateMetadata` abre um cliente Supabase próprio e faz `select("title")` de `courses`. O mesmo dado é buscado novamente na execução principal da página via `select("*")`. Next.js não deduplica as queries entre `generateMetadata` e o componente — são 2 round-trips para o mesmo dado.

Abordagem sugerida: aceitar por ora (dado mínimo) ou remover `generateMetadata` e usar `<title>` dinâmico via layout.

### [SUGGESTION] `page.tsx` — erro da query de aulas ignorado

`aulasResult.error` não é verificado. Se a query falhar, o usuário vê estado vazio ao invés de uma mensagem de erro.

Fix sugerido:
```typescript
if (aulasResult.error) {
  return <p className={cn("text-sm text-destructive p-6")}>Erro ao carregar aulas.</p>
}
```

### [SUGGESTION] `view.tsx` — altura inconsistente entre `<Image>` e placeholder

`<Image>` usa `height={135}` (135px intrínseco) mas o placeholder div usa `h-36` (144px). Diferença visível ao alternar entre cursos com e sem thumbnail.

Fix: unificar para `height={144}` no `<Image>` ou `h-[135px]` no placeholder.

### [SUGGESTION] `view.tsx` — botão "← Minha Área" usa seta Unicode

`U+2190` é anunciado como "left arrow Minha Área" por leitores de tela.

Fix sugerido: substituir por `<ArrowLeft className={cn("size-4")} aria-hidden="true" />` de lucide-react.

### [QUESTION] `Set<string>` como prop de Server Component

`concluidas: Set<string>` é passado de `page.tsx` para `view.tsx` — válido pois ambos são Server Components (sem serialização). Se `view.tsx` migrar para `"use client"`, a prop quebrará silenciosamente (Set não é serializável para JSON). Vale documentar em `architecture.md` como restrição da decisão ADR-FE-026.

### [PRAISE]

- Auth guard → enrollment check → data fetch: cascata de validações sequenciada antes de qualquer render — defensivo sem camadas desnecessárias.
- Estado vazio (`aulas.length === 0`) com ícone + texto descritivo — claramente distinto de erro.
- `role="list"` na `<ol>` com `list-none` restaura semântica para VoiceOver/Safari — detalhe de acessibilidade raro e correto.

**Decisão:** Aprovado — 0 BLOCKERs. SUGGESTIONs podem ser resolvidas em iteração posterior.
