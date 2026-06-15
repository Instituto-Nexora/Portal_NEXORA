# Memória: player-aula

> Aprendizados acumulados de todos os roles que trabalharam nesta feature.

<!-- SUMMARY -->
<!-- /SUMMARY -->

<!-- RECENTES -->
## [frontend-001 · init] — 2026-06-15

Task: Player de vídeo para aulas na área do aluno — issue #21
Issue: #21 (GitHub — Instituto-Nexora/Portal_NEXORA)
Depende de: #18, #20 (lessons table criada), #22 (lesson_progress), #26 (auth)

[DECISÃO CRÍTICA] Bug pré-existente em calcularProgressoCurso.ts: usa .eq("status", "published") mas a tabela lessons tem is_published BOOLEAN. Corrigir para .eq("is_published", true).

[DECISÃO CRÍTICA] lesson_progress pode não ter migration — verificar e criar 00008_lesson_progress_schema.sql se necessário.
<!-- /RECENTES -->
