# Review Notes: fix-update-fluxo-criar-eventos

> Notas de revisão de todos os roles. Append-only.

---

## Review — 2026-05-12
**Reviewer:** Renata Revisão  
**Feature:** Player de Vídeo — Área do Aluno

### Resumo
- 🔴 **BLOCKERs:** 0
- 🟡 **SUGGESTIONs:** 3
- ❓ **QUESTIONs:** 2
- 🟢 **PRAISEs:** 7

### Verificação de ADRs
| ADR | Status |
|-----|--------|
| **ADR-001** App Router | ✅ **[RESPEITADA]** `page.tsx` é Server Component |
| **ADR-004** MVVM | ✅ **[RESPEITADA]** view + viewModel + actions separados |
| **ADR-005** Type-only | ✅ **[RESPEITADA]** Apenas `type` (nenhuma `interface`) |
| **ADR-007** cn() | ✅ **[RESPEITADA]** Todo `className` usa `cn()` |

### Comentários

#### [PRAISE] Ótima estrutura Server Component
Autenticação → Matrícula → Fetch de dados. Ordem correta de guards. `generateMetadata` separado.

#### [PRAISE] Excelente separação MVVM
`view.tsx` = só JSX, `viewModel.tsx` = lógica/hooks. Nenhuma mistura.

#### [PRAISE] Acessibilidade presente
`aria-label="Aulas do curso"`, `aria-current="page"`, `<button type="button">`.

#### [PRAISE] Empty states tratados
"Vídeo indisponível", "Nenhuma aula disponível".

#### [PRAISE] Estado otimista com rollback
`setAulas()` antes da request + rollback no `catch`. Bom UX.

#### [PRAISE] Server Action segura
`getUser()` dentro da action, não confia em user_id do client. `.upsert()` com `onConflict`.

#### [PRAISE] Função `extractVideoId` pura e testável
Isolada em `utils/video.ts`. Fácil de testar.

---

#### [SUGGESTION] Queries paralelas no page.tsx
Atualmente são 4 queries sequenciais. Usar `Promise.all` para paralelizar:
```ts
const [enrollmentResult, aulaResult, lessonsResult] = await Promise.all([
  supabase.from("course_enrollments").select(...),
  supabase.from("lessons").select(...),
  supabase.from("lessons").select("*, lesson_progress!left(completed)"),
]);
```

#### [SUGGESTION] `loading="lazy"` no iframe
Melhora performance em páginas com muitos vídeos.

#### [SUGGESTION] Validação de matrícula na Server Action
RLS deve proteger, mas validação extra é defensiva.

---

#### [QUESTION] Query única vs múltiplas queries
A arquitetura recomendava JOIN via `.select("*, lesson_progress!left()")`. Atualmente são 2 queries separadas. Há motivo específico?

#### [QUESTION] Estado otimista + router.refresh()
`setAulas()` otimista + `router.refresh()` em sequência. O refresh sobrescreve o estado otimista. Isso é intencional?

---

### Decisão
✅ **APROVADO**

Nenhum BLOCKER. Sugestões são melhorias opcionais para pós-MVP.

**Build:** ✅ `npm run build` passou sem erros

(preenchido durante revisões)
