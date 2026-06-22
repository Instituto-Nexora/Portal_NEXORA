# Contexto: emissao-certificado

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.

## O que é

Issue #23 (P0) — Sub-task da Epic #7 (Módulo de Cursos). Emissão de certificado em PDF quando o aluno conclui 100% das aulas publicadas de um curso. Gerado server-side via Route Handler `GET /api/certificados/[courseId]`, com nome do aluno, nome do curso, data de conclusão e código de verificação único (UUID).

## Por que existe

Alunos que concluem um curso precisam de prova de conclusão. Depende de #22 (progresso — já implementado, `calcularProgressoCurso`) e #26 (auth — `supabase.auth.getUser()`, já em uso no projeto).

## Decisões tomadas

- **[DECISÃO PENDENTE → RESOLVIDA pelo usuário]** Local do botão "Baixar Certificado": sidebar do Player (`/minha-area/cursos/[cursoId]/aulas/[aulaId]`), junto ao contador de progresso — não criar página de detalhe de curso nova, pois ela não existe hoje (a rota `/minha-area/cursos/[cursoId]/aulas` apenas redireciona para a 1ª aula).
- `CursoCard.tsx` (issue #24) **já** linka para `/api/certificados/${courses.id}` quando `percentual >= 100` — a rota precisa apenas ser criada para esse fluxo funcionar.
- Biblioteca: `@react-pdf/renderer` (recomendada pela issue), instalada via npm.
- `student_profiles.full_name` é a fonte do nome do aluno no certificado (schema `00005_student_profile_preferences.sql`).

## O que não fazer

- Nunca expor lógica de geração do PDF ao cliente — tudo server-side no Route Handler
- Não criar página de detalhe de curso `/minha-area/cursos/[cursoId]/page.tsx` nesta issue — fora do escopo decidido
- Não permitir download sem progresso 100% — Route Handler deve retornar 403
