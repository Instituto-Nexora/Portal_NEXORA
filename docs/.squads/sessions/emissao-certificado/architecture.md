# Decisão Arquitetural: emissao-certificado

**Data:** 2026-06-16
**Agent:** Ana Arquitetura

---

## Entendimento da Task

Issue #23 (P0): emitir certificado em PDF quando o aluno conclui 100% das aulas publicadas de um curso. Geração 100% server-side via Route Handler `GET /api/certificados/[courseId]`, sem expor lógica ao cliente. Botão de download na sidebar do Player (decisão do usuário — não existe página de detalhe de curso no projeto).

`CursoCard.tsx` (issue #24) **já** referencia `/api/certificados/${courses.id}` — esta feature só precisa criar a rota que falta.

---

## Estrutura de Arquivos

```
src/app/api/certificados/[courseId]/
├── route.ts                  → Route Handler GET — auth, valida 100%, gera e retorna o PDF
└── CertificadoDocument.tsx   → componente @react-pdf/renderer (Document/Page/View/Text) + type CertificadoData
```

Arquivos existentes a corrigir/ajustar:
```
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx
src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/viewModel.tsx (se necessário)
package.json   → adicionar @react-pdf/renderer
```

Nenhuma migration nova — não há requisito de persistir/verificar o certificado externamente (fora do escopo da issue).

---

## Fluxo do Route Handler

```typescript
// src/app/api/certificados/[courseId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params
  const supabase = await createClient() // sessão do aluno — nunca admin

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 401

  const { data: curso } = await supabase.from("courses").select("title").eq("id", courseId).single()
  if (!curso) return 404

  const { concluidas, total, percentual } = await calcularProgressoCurso(courseId, user.id)
  if (total === 0 || percentual < 100) return 403 // aluno não concluiu o curso

  const { data: profile } = await supabase.from("student_profiles").select("full_name").eq("id", user.id).single()

  // data de conclusão = completed_at mais recente entre as aulas do curso
  const { data: lessons } = await supabase.from("lessons").select("id").eq("course_id", courseId).eq("is_published", true)
  const { data: ultimoProgresso } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .in("lesson_id", lessons.map(l => l.id))
    .order("completed_at", { ascending: false })
    .limit(1)
    .single()

  const buffer = await renderToBuffer(
    React.createElement(CertificadoDocument, {
      data: {
        studentName: profile.full_name,
        courseName: curso.title,
        completedAt: formatDateLong(ultimoProgresso?.completed_at ?? new Date().toISOString()),
        verificationCode: crypto.randomUUID(),
      },
    })
  )

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificado-${slugify(curso.title)}.pdf"`,
    },
  })
}
```

> **`route.ts` não usa JSX diretamente** — `React.createElement` evita a necessidade de `.tsx` num Route Handler (convenção Next.js: `route.ts`/`route.js`, nunca `route.tsx`).
> Reuso de utils existentes: `formatDateLong` (`src/utils/formatDate.ts`), `slugify` (`src/utils/slugify.ts`), `calcularProgressoCurso` (`src/utils/calcularProgressoCurso.ts`) — ADR-006.

---

## Type `CertificadoData`

```typescript
// CertificadoDocument.tsx
type CertificadoData = {
  studentName: string
  courseName: string
  completedAt: string   // já formatado pt-BR (formatDateLong)
  verificationCode: string
}
```

---

## Decisões de Estado

| Estado | Tipo | Justificativa |
|--------|------|---------------|
| Geração do PDF | Server-side (Route Handler) | Nunca expor lógica/dados ao cliente — requisito explícito da issue |
| Botão "Baixar Certificado" no Player | Derivado de `aulas`/`concluidas` já existentes (sem novo estado) | Reaproveita o estado de progresso já carregado pela feature #21 |

---

## Bug encontrado nesta investigação (corrigir junto)

`PlayerAulaView` (`view.tsx`) usa `concluidas.size` para exibir "X de Y concluídas" — mas `concluidas` vem de **todas** as `lesson_progress` do aluno (`page.tsx` busca sem filtrar por curso), não apenas as do curso atual. Em aluno matriculado em múltiplos cursos, o contador fica inflado e o critério de "100% concluído" pode nunca fechar corretamente (ou fechar errado).

**Fix:** derivar o total concluído filtrando `aulas` (já escopadas ao curso) pela presença em `concluidas`:
```typescript
const aulasCursoConcluidas = aulas.filter((a) => concluidas.has(a.id)).length
const isCursoCompleto = aulas.length > 0 && aulasCursoConcluidas === aulas.length
```
Usar `aulasCursoConcluidas` no texto do contador e `isCursoCompleto` para mostrar o botão "Baixar Certificado".

---

## ADR

### ADR-FE-025: Certificado não persiste código de verificação

**Contexto:** a issue pede um "código de verificação único (UUID)" impresso no PDF, mas não pede endpoint de verificação pública nem histórico de emissões.
**Decisão:** gerar `crypto.randomUUID()` no momento da requisição, sem persistir em tabela nova.
**Alternativas rejeitadas:** tabela `certificate_issuances` com código + data — fora do escopo aceito da issue (YAGNI).
**Consequências:** ✅ Sem migration nova / ⚠ Re-download gera um código diferente a cada vez — se verificação pública for pedida no futuro, será necessário persistir.

---

## Arquivos a Modificar / Criar

- `package.json` ← adicionar `@react-pdf/renderer`
- `src/app/api/certificados/[courseId]/route.ts` ← criar
- `src/app/api/certificados/[courseId]/CertificadoDocument.tsx` ← criar
- `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx` ← editar (fix do contador + botão certificado)

---

## Pontos de Atenção para o Dev

1. `params` é `Promise<{ courseId: string }>` no Route Handler (Next.js 16) — `await params`
2. `createClient()` (sessão do aluno), nunca `createAdminClient()` — esta rota é do aluno autenticado
3. 401 sem sessão, 404 curso inexistente, 403 progresso < 100% — nessa ordem
4. `renderToBuffer` é assíncrono — `await`
5. Resposta deve ter `Content-Type: application/pdf` e `Content-Disposition: attachment` para forçar download
6. Reaproveitar `formatDateLong`, `slugify`, `calcularProgressoCurso` — não duplicar (ADR-006)
