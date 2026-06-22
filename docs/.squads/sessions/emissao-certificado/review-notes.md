# Review Notes: emissao-certificado

> Notas de revisão de todos os roles. Append-only.

## Review — 2026-06-16 (Renata Revisão)

### [BLOCKER] RLS ausente em `lessons` e `lesson_progress` (pré-existente, issues #20/#21)

As tabelas `lessons` (00007) e `lesson_progress` (00008) nunca tiveram `ENABLE ROW LEVEL SECURITY` nem policies, diferente de `student_profiles`/`courses`/`enrollments` (00003). Qualquer usuário autenticado podia, via API direta do Supabase (fora do app Next.js), ler progresso de outros alunos ou forjar `lesson_progress` para destravar o certificado sem concluir o curso de fato.

**Fix aplicado:** `src/databases/00009_lessons_lesson_progress_rls.sql`
- `lessons`: SELECT liberado apenas se `is_published = true` E o usuário tem `enrollment` para o `course_id` (impede acesso a `video_url` de quem não pagou)
- `lesson_progress`: SELECT/INSERT/UPDATE restritos a `auth.uid() = user_id`

Validado que CMS (`createAdminClient()` — service role) não é afetado, pois RLS não se aplica à service role key.

### [BLOCKER] Contador de progresso do Player somava lesson_progress de todos os cursos

`PlayerAulaView` usava `concluidas.size` (todas as conclusões do aluno, sem filtro de curso) tanto para o texto "X de Y concluídas" quanto implicitamente para qualquer lógica de 100%. Em aluno com múltiplos cursos isso inflava a contagem.

**Fix aplicado:** `aulasCursoConcluidas = aulas.filter((a) => concluidas.has(a.id)).length`, com `aulas` já escopado ao curso atual (`page.tsx` já filtra por `course_id` + `is_published`). `isCursoCompleto` derivado dessa contagem corrigida.

### [SUGGESTION] Código de verificação do certificado não é persistido

`crypto.randomUUID()` é gerado a cada download — re-emitir o certificado gera um código diferente. Aceitável para o escopo da issue #23 (sem requisito de verificação pública), mas se isso for pedido no futuro será necessário uma tabela de emissões.

### [SUGGESTION] Sem checagem explícita de `enrollment` na rota de certificado

A rota `/api/certificados/[courseId]` não verifica `enrollments` diretamente — depende de `calcularProgressoCurso` retornar `total > 0` e `percentual === 100`, o que só é possível para quem está matriculado (e agora reforçado pela RLS de `lessons`). Funciona corretamente, mas uma checagem explícita deixaria a intenção mais clara para quem ler o código depois.

### [QUESTION] Nome do aluno ausente em `student_profiles`

Se `profile?.full_name` vier `null`/ausente (linha não encontrada), o certificado usa fallback `"Aluno NEXORA"`. Como `student_profiles.full_name` é `NOT NULL` no schema (00005), esse caso só ocorreria se o profile não existir — cenário já tratado pelo app (trigger de cadastro cria o profile). Fallback é defensivo, não bloqueante.

### [PRAISE]

- Reuso consistente de `calcularProgressoCurso`, `formatDateLong` e `slugify` — zero duplicação (ADR-006)
- `route.ts` permanece livre de JSX (convenção `route.ts`/`route.js`) chamando `CertificadoDocument({ data })` diretamente em vez de `React.createElement`/JSX, evitando cast `any` para satisfazer o tipo `ReactElement<DocumentProps>` exigido por `renderToBuffer`
- Ordem de validação clara: 401 → 404 → 403 antes de qualquer geração de PDF
