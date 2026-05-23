# Review Notes — Minha Área / Cursos do Aluno

**Data:** 2026-05-15
**Reviewer:** Renata Revisão

## Resumo
- BLOCKERs: 1
- SUGGESTIONs: 2
- QUESTIONs: 1
- PRAISEs: 2

## Comentários

[BLOCKER] Ausência de tratamento de erro nas queries Supabase em page.tsx
As 4 queries Supabase (auth, enrollments, lessons, progress) não possuem try/catch. Se qualquer uma falhar, o erro será lançado sem tratamento, resultando em uma tela de erro genérica do Next.js.

Fix sugerido:
Envolva as queries em try/catch e retorne um estado de erro explícito:

```typescript
export default async function MinhaAreaPage() {
  try {
    const supabase = await createClient();
    // ... queries
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
    return <MinhaAreaViewError />;
  }
}
```

Ou crie um `error.tsx` no diretório da rota para o App Router capturar o erro.

---

[SUGGESTION] Progresso ainda calculado inline (page.tsx:72-93)
ADR-002 recomenda ler `enrollment.progress_percent` direto do banco. O cálculo atual resolve o N+1 mas ainda duplica lógica que o trigger Postgres deveria prover. Sugiro criar o trigger DB e migrar para leitura direta assim que possível.

---

[SUGGESTION] Extrair lógica de montagem dos cursos para hook
A lógica de montagem dos `CursoComProgresso[]` (page.tsx:74-93) poderia viver em `use-minha-area.ts` como `buildCursosComProgresso()`. Mantém page.tsx ainda mais enxuto.

---

[QUESTION] CourseCard usa `nativeButton={false}` com `render={<Link />}`
O Button do Shadcn com `render` prop + Link funciona corretamente? Em Server Components, o Link do Next.js é cliente. Verificar se não quebra o Server Component boundary.

---

[PRAISE] Estrutura de componentes e tipos
Excelente colocation em `_features/minha-area/`. Tipos limpos, componentes com responsabilidade única. CourseCard com `role="progressbar"` e `aria-valuenow` é um ótimo exemplo de acessibilidade em componentes de progresso.

---

[PRAISE] Loading state com skeleton dedicado
CourseCardSkeleton replica fielmente o layout do card. O loading.tsx com 6 skeletons dá feedback visual imediato sem layout shift. Padrão a ser seguido em outras features.

## Decisão
Aprovado com ressalvas — corrigir BLOCKER (error handling) antes de merge.
