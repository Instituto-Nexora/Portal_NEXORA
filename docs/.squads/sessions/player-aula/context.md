# Contexto: player-aula

> Arquivo central da feature. Lido por todos os roles antes de executar qualquer step.

## O que é

Player de vídeo para aulas na área do aluno. Rota: `/minha-area/cursos/[cursoId]/aulas/[aulaId]`. Exibe embed de vídeo (YouTube/Vimeo via iframe), sidebar com todas as aulas do curso e indicadores de progresso, e botão "Marcar como concluída".

## Por que existe

Alunos matriculados precisam assistir aulas e acompanhar seu progresso dentro de um curso. Depende de #18 (schema), #20 (aulas), #22 (progresso) e #26 (auth).

## Decisões tomadas

- `createClient()` (não `createAdminClient()`) — rota do aluno, usa sessão autenticada
- Verificação de matrícula no Server Component: redireciona para `/vendas` se não matriculado
- Video embed via `<iframe>` simples — sem lib externa de player
- Progresso lido no Server Component, passado como prop para o Client
- `lesson_progress` tabela: `(user_id, lesson_id)` UNIQUE — inserção idempotente via `upsert`
- `revalidatePath` após marcar conclusão para re-render do Server Component

## O que não fazer

- Nunca `"use client"` em `page.tsx`
- Nunca `createAdminClient()` nesta rota — usa sessão do aluno
- Não implementar DRM ou player customizado — iframe simples para MVP
- Não redirecionar para `/login` dentro do player — o middleware já cobre isso
