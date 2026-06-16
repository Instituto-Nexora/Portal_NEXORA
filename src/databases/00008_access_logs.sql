-- ==============================================================================
-- MIGRATION: 00008_access_logs
-- Sistema de log de acessos para métricas de cursos, eventos e páginas.
-- Logging é feito server-side via service role — alunos não têm acesso direto.
-- ==============================================================================

-- UP
BEGIN;

CREATE TABLE public.access_logs (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID        REFERENCES public.student_profiles(id) ON DELETE SET NULL,
  resource_type TEXT        NOT NULL CHECK (resource_type IN ('course', 'event', 'page')),
  resource_id   UUID,
  resource_slug TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_logs_student_id    ON public.access_logs(student_id);
CREATE INDEX idx_access_logs_resource_type ON public.access_logs(resource_type);
CREATE INDEX idx_access_logs_created_at    ON public.access_logs(created_at DESC);
CREATE INDEX idx_access_logs_resource_id   ON public.access_logs(resource_id)
  WHERE resource_id IS NOT NULL;

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
-- Sem políticas explícitas: service role bypassa RLS para INSERT/SELECT.
-- Alunos autenticados não conseguem ler nem escrever diretamente.

-- View para top recursos — consultada pelo dashboard de relatórios via service role.
CREATE VIEW public.access_log_top_resources AS
SELECT
  resource_type,
  resource_id,
  resource_slug,
  COUNT(*)                AS access_count,
  COUNT(DISTINCT student_id) AS unique_students,
  MAX(created_at)         AS last_accessed_at
FROM public.access_logs
GROUP BY resource_type, resource_id, resource_slug
ORDER BY access_count DESC;

COMMIT;

-- ==============================================================================
-- DOWN (reversão)
-- ==============================================================================
/*
BEGIN;
DROP VIEW  IF EXISTS public.access_log_top_resources;
DROP TABLE IF EXISTS public.access_logs;
COMMIT;
*/
