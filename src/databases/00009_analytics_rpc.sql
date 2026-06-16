-- ==============================================================================
-- MIGRATION: 00009_analytics_rpc
-- Substitui a VIEW access_log_top_resources por uma função RPC.
-- Views com GROUP BY + COUNT podem não ser expostas corretamente pelo PostgREST.
-- Funções SECURITY DEFINER são mais confiáveis para agregações via service role.
-- ==============================================================================

-- UP
BEGIN;

DROP VIEW IF EXISTS public.access_log_top_resources;

CREATE OR REPLACE FUNCTION public.get_top_resources(limit_n INT DEFAULT 10)
RETURNS TABLE (
  resource_type    TEXT,
  resource_id      UUID,
  resource_slug    TEXT,
  access_count     BIGINT,
  unique_students  BIGINT,
  last_accessed_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    resource_type,
    resource_id,
    resource_slug,
    COUNT(*)                   AS access_count,
    COUNT(DISTINCT student_id) AS unique_students,
    MAX(created_at)            AS last_accessed_at
  FROM public.access_logs
  GROUP BY resource_type, resource_id, resource_slug
  ORDER BY access_count DESC
  LIMIT limit_n;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_resources(INT) TO service_role;

COMMIT;

-- ==============================================================================
-- DOWN (reversão)
-- ==============================================================================
/*
BEGIN;
DROP FUNCTION IF EXISTS public.get_top_resources(INT);
COMMIT;
*/
