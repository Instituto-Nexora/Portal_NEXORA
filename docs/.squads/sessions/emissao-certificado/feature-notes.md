# Feature Notes: emissao-certificado

> Issue #23 — Cursos: Implementar emissão de certificado (PDF)
> Pipeline: feature-development | Squad: frontend-001
> Concluído em: 2026-06-18

---

## O que foi implementado

### Rota de geração de certificado (PDF)

**`src/app/api/certificados/[courseId]/route.ts`**

Route Handler GET com fluxo de validação em cascata:
1. `401` — usuário não autenticado
2. `404` — `courseId` não existe em `courses`
3. `403` — `percentual < 100` ou `total === 0` (curso não concluído)
4. `200` — PDF gerado e retornado como `application/pdf`

Usa `createClient()` (sessão do aluno — RLS ativo), nunca `createAdminClient()`.

**`src/app/api/certificados/[courseId]/CertificadoDocument.tsx`**

Componente React-PDF exportado como função pura (não via `export default`). Chamado como `CertificadoDocument({ data })` diretamente em `route.ts` para satisfazer o tipo `ReactElement<DocumentProps>` exigido por `renderToBuffer` — sem cast `any`, sem `React.createElement`.

Design: A4 landscape, fundo teal escuro (`#0D3D37`), borda âmbar (`#F59E0B`), nome do aluno em branco, nome do curso em âmbar.

### Botão "Baixar Certificado" no Player

**`src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx`**

Botão condicional na sidebar do PlayerAula. Aparece apenas quando `isCursoCompleto === true`. Aponta para `/api/certificados/${curso.id}`.

### Correção de bug pré-existente (issue #21)

O contador de progresso no Player usava `concluidas.size` — que somava lesson_progress de **todos** os cursos do aluno, não apenas do atual. Corrigido com:

```ts
const aulasCursoConcluidas = aulas.filter((a) => concluidas.has(a.id)).length
```

`aulas` já está escopado ao curso pelo `page.tsx` (`course_id` + `is_published`).

### Migration de segurança (pré-existente, fechada agora)

**`src/databases/00009_lessons_lesson_progress_rls.sql`**

`lessons` e `lesson_progress` foram criadas sem RLS nas issues #20/#21. Qualquer usuário autenticado podia ler progresso de outros ou forjar `lesson_progress` para desbloquear o certificado sem concluir o curso.

- `lessons` SELECT: `is_published = true` AND `enrollment` existe para o `course_id`
- `lesson_progress` SELECT/INSERT/UPDATE: `auth.uid() = user_id`

CMS (`createAdminClient()` — service role) não é afetado: RLS não se aplica à service role key.

---

## Padrões aplicados

| Padrão | Aplicação |
|--------|-----------|
| ADR-002 (Supabase security) | `createClient()` em rotas de aluno, `createAdminClient()` exclusivamente no CMS |
| ADR-006 (utils reuse) | `calcularProgressoCurso`, `formatDateLong`, `slugify` reutilizados — zero duplicação |
| Next.js 16 Route Handler | `params: Promise<{courseId: string}>` com `await params` |
| `route.ts` sem JSX | `CertificadoDocument({data})` chamado como função pura, não via JSX |
| `Uint8Array(buffer)` | `renderToBuffer` retorna `Buffer<ArrayBufferLike>` — `new Uint8Array(buffer)` para satisfazer `BodyInit` |

---

## Decisões de escopo (YAGNI)

- **Código de verificação não persistido** — `crypto.randomUUID()` gerado a cada download. Re-emitir gera código diferente. Sem requisito de verificação pública na issue #23. Tabela de emissões fica para quando o requisito existir.
- **Sem checagem explícita de `enrollment` na rota** — `calcularProgressoCurso` já depende de enrollment (só retorna `total > 0` para matriculados), reforçado pela RLS de `lessons`. Funciona corretamente sem duplicar a verificação.

---

## Migrações pendentes de execução no Supabase

As migrações abaixo foram criadas mas ainda precisam ser aplicadas no projeto Supabase (SQL Editor ou Supabase CLI):

| Arquivo | Conteúdo |
|---------|----------|
| `src/databases/00007_lessons.sql` | Tabela `lessons` |
| `src/databases/00008_lesson_progress.sql` | Tabela `lesson_progress` |
| `src/databases/00009_lessons_lesson_progress_rls.sql` | RLS de `lessons` e `lesson_progress` |

**Ordem obrigatória**: 00007 → 00008 → 00009 (dependências de FK).

---

## Arquivos criados / modificados

| Arquivo | Operação |
|---------|----------|
| `src/app/api/certificados/[courseId]/route.ts` | Criado |
| `src/app/api/certificados/[courseId]/CertificadoDocument.tsx` | Criado |
| `src/databases/00009_lessons_lesson_progress_rls.sql` | Criado |
| `src/app/(publics)/minha-area/cursos/[cursoId]/aulas/[aulaId]/_features/PlayerAula/view.tsx` | Modificado |
| `package.json` / `package-lock.json` / `yarn.lock` | Modificado (`@react-pdf/renderer@^4.5.1`) |
| `.synapos/squads/frontend-001/squad.yaml` | Atualizado (feature ativa) |
