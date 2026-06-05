# Review Notes — Controle de Progresso do Aluno (Issue #22)

**Data:** 2026-06-05
**Reviewer:** Renata Revisão
**Arquivos revisados:**
- `src/utils/calcularProgressoCurso.ts`
- `src/app/(private)/minha-area/_features/MeusCursos/actions.ts`
- `src/lib/supabase/types.ts`
- `src/app/(private)/minha-area/page.tsx`

---

## Resumo

- BLOCKERs: 0
- SUGGESTIONs: 1
- PRASEs: 8

---

## Verificação de ADRs

| ADR | Status |
|-----|--------|
| ADR-001 (Server Component) | ✅ sem `"use client"` em page.tsx |
| ADR-004 (MVVM) | ✅ NÃO APLICÁVEL — page.tsx com mock data; actions em `_features/` |
| ADR-005 (Type-only) | ✅ todos `type`, nenhum `interface` |
| ADR-006 (utils reutilizáveis) | ✅ `calcularProgressoCurso` em `src/utils/` |
| ADR-007 (cn()) | ✅ em todo `className` |
| ADR-008 (Paleta Teal + Amber) | ✅ `bg-teal-700` e `bg-teal-100` |
| ADR-009 (Shadcn first) | ✅ `<Progress>` do Shadcn |

---

## Comentários

[SUGGESTION] `calcularProgressoCurso.ts`:22 — Non-null assertion `lessons!`

O `lessons!.map(...)` usa non-null assertion. O guard `if (total === 0)` garante que `lessons` não é null aqui, tornando o `!` seguro. Para MVP é aceitável. Em iteração futura, considerar:
```ts
const lessonIds = (lessons ?? []).map((l: { id: string }) => l.id)
```

---

[PRAISE] Retorno antecipado em `calcularProgressoCurso` quando `total === 0`.
Previne divisão por zero e retorna `ProgressResult` válido sem branch complexo.

[PRAISE] `upsert` com `onConflict: "user_id,lesson_id"` em `marcarAulaConcluida`.
Idempotente — chamar duas vezes não duplica registros.

[PRAISE] `ProgressResult` com nomenclatura pt-BR (`concluidas`, `total`, `percentual`).
Alinhado com `CursoCard.tsx` e `(publics)/minha-area/page.tsx` do mesmo branch.

[PRAISE] `render={<Link />}` + `nativeButton={false}` em `Button`.
Padrão correto para Base UI — sem `asChild` Radix que não existe neste projeto.

[PRAISE] `indicatorClassName` diferencia progresso parcial (teal-700) de completo (teal-500).
Visual teal consistente com a identidade visual — elimina o `bg-blue-600` e `bg-green-500` que violavam ADR-008.

[PRAISE] TODO com código comentado em `page.tsx` documenta integração futura com Supabase.
Desenvolvedor futuro sabe exatamente o que substituir quando issue #18 for entregue.

[PRAISE] `aria-label` na barra de progresso.
Leitores de tela anunciam "Progresso do curso X: 35%" — acessibilidade correta.

[PRAISE] TypeScript e Biome sem erros após as correções.
Build limpo, zero regressões.

---

## Decisão

**✅ APROVADO** — 0 BLOCKERs. 1 SUGGESTION de baixa prioridade para pós-MVP.
