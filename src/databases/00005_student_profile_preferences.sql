-- ==============================================================================
-- MIGRATION: 00005_student_profile_preferences
-- Objetivo: suporte para metadados de perfil dos alunos, criação do bucket 'images' e políticas (RLS).
-- ==============================================================================

BEGIN;

-- 1. Colunas opcionais para auditoria e cooldown de alterações no banco para alunos.
ALTER TABLE public.student_profiles
  ADD COLUMN IF NOT EXISTS profile_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS avatar_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. Garantir que o bucket 'images' existe, é público e aceita imagens.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Políticas de Segurança (RLS) para o bucket 'images' focadas nos Alunos
DROP POLICY IF EXISTS "Todos podem ver imagens de perfil dos alunos" ON storage.objects;
CREATE POLICY "Todos podem ver imagens de perfil dos alunos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images' AND name LIKE 'avatars/student-profiles/%');

DROP POLICY IF EXISTS "Alunos podem inserir o próprio avatar" ON storage.objects;
CREATE POLICY "Alunos podem inserir o próprio avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
    AND name LIKE ('avatars/student-profiles/' || auth.uid() || '/%')
  );

DROP POLICY IF EXISTS "Alunos podem atualizar o próprio avatar" ON storage.objects;
CREATE POLICY "Alunos podem atualizar o próprio avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
    AND name LIKE ('avatars/student-profiles/' || auth.uid() || '/%')
  );

COMMIT;
