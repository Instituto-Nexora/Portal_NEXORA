-- ==============================================================================
-- MIGRATION: 00010_fix_access_logs_student_fk
-- Remove a FK constraint de student_id → student_profiles.
-- Motivo: usuários sem student_profiles (ex: admins do CMS acessando o portal
-- público) causavam violação de FK silenciosa. access_logs é uma tabela de
-- analytics — não precisa de integridade referencial no student_id.
-- ==============================================================================

-- UP
BEGIN;

ALTER TABLE public.access_logs
  DROP CONSTRAINT IF EXISTS access_logs_student_id_fkey;

COMMIT;

-- ==============================================================================
-- DOWN (reversão)
-- ==============================================================================
/*
BEGIN;
ALTER TABLE public.access_logs
  ADD CONSTRAINT access_logs_student_id_fkey
  FOREIGN KEY (student_id) REFERENCES public.student_profiles(id) ON DELETE SET NULL;
COMMIT;
*/
