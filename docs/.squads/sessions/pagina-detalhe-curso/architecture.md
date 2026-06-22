# Decisão Arquitetural: pagina-detalhe-curso

**Data:** 2026-06-18
**Agent:** Ana Arquitetura FE

## Entendimento da Task

Criar a página `/minha-area/cursos/[cursoId]` que exibe o detalhe do curso — thumbnail, título, descrição, barra de progresso e lista de aulas publicadas com status individual (concluída / não iniciada). Cada aula é um link direto para o player. O botão "Baixar Certificado" aparece quando `percentual === 100`.

Atualmente esse segmento de rota não existe: `CursoCard` aponta para `/minha-area/cursos/[cursoId]/aulas` (que redireciona para a primeira aula). Após esta feature, o fluxo passa a ser: `CursoCard → detalhe → player de aula`.

## Estrutura de Arquivos

```
src/app/(publics)/minha-area/cursos/[cursoId]/
├── page.tsx                                     ← Server Component — fetch + auth
└── _features/DetalhesCurso/
    └── view.tsx                                 ← Server Component — UI pura (sem "use client")
```

**Arquivos modificados:**
```
src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx
  ↳ continueHref: /minha-area/cursos/${courses.id}/aulas  →  /minha-area/cursos/${courses.id}
```

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Dados do curso | Server fetch (page.tsx) | Server Component — sem re-fetch no cliente |
| Lista de aulas | Server fetch (page.tsx) | Ordenado por `position`, filtrado `is_published` |
| Progresso | `calcularProgressoCurso()` | Util existente — zero duplicação (ADR-006) |
| IDs de aulas concluídas | Server fetch (page.tsx) | Set de IDs de `lesson_progress` para o usuário |

Sem estado local — página puramente display. `view.tsx` não precisa de `"use client"`.

## Contratos dos Componentes

```typescript
// page.tsx → view.tsx
type DetalhesCursoViewProps = {
  curso: Curso
  aulas: Aula[]
  concluidas: Set<string>   // IDs de aulas com lesson_progress
  progresso: ProgressResult
}
```

## ADR

### ADR-FE-026: view.tsx sem "use client" em páginas puramente display

**Contexto:** ADR-004 define view.tsx como `"use client"` + JSX. Porém, essa regra nasceu para páginas com formulários, handlers de evento e estado local. A página de detalhe do curso é read-only — sem forms, sem onClick, sem useState.

**Decisão:** `view.tsx` é Server Component (sem `"use client"`) quando a página for estritamente display e não houver previsão de interatividade próxima. `page.tsx` continua sendo Server Component (regra inviolável do ADR-001).

**Alternativas rejeitadas:**
- Adicionar `"use client"` desnecessário em view.tsx: transformaria um Server Component em Client Component sem nenhum benefício — aumenta bundle do cliente e perde streaming.
- Embutir JSX diretamente em page.tsx: aceitável para páginas simples, mas esta tem UI suficientemente complexa para justificar extração.

**Consequências:**
✅ Server Component preservado — zero JS extra no bundle
✅ Streaming e Suspense disponíveis
⚠ Se interatividade for adicionada no futuro, `"use client"` precisará ser adicionado ao view.tsx (mudança trivial)

## Pontos de Atenção para o Dev

1. **Auth + enrollment**: page.tsx deve verificar autenticação (redirect `/login`) e que o aluno tem enrollment no curso (404 se não tiver).
2. **RLS ativa**: com `00009`, `lessons` exige enrollment para SELECT — a query de aulas já filtra automaticamente via RLS, mas o check de enrollment deve ser explícito para retornar 404 adequado.
3. **`concluidas` como `Set<string>`**: filtrar `lesson_progress` pelo array de `lessonIds` do curso (mesma lógica usada em `route.ts` do certificado) — evita poluição cross-curso.
4. **`continueHref` no CursoCard**: mudar para `/minha-area/cursos/${courses.id}` — o redirect `/aulas` é mantido para compatibilidade com links externos.
5. **`calcularProgressoCurso`** já retorna `{ concluidas, total, percentual }` — reutilizar diretamente (ADR-006).

## Arquivos a modificar/criar

- `src/app/(publics)/minha-area/cursos/[cursoId]/page.tsx`
- `src/app/(publics)/minha-area/cursos/[cursoId]/_features/DetalhesCurso/view.tsx`
- `src/app/(publics)/minha-area/_features/MinhAreaCursos/CursoCard.tsx`
