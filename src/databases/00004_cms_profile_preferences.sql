-- ==============================================================================
-- MIGRATION: 00004_cms_profile_preferences
-- Objetivo: suporte incremental para perfil CMS, avatar e cooldown de alterações.
-- Execute no Supabase SQL Editor após revisar nomes de bucket/políticas do projeto.
-- ==============================================================================

BEGIN;

-- 1. Colunas opcionais para endurecer o cooldown no banco.
-- A aplicação incremental usa Supabase Auth metadata para não quebrar ambientes
-- antes desta migration. Estas colunas permitem auditoria e enforcement futuro.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS avatar_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS password_last_changed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- 2. Bucket de avatars.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. Políticas de Storage para administradores autenticados gerenciarem apenas
-- o próprio diretório. O upload da aplicação usa service role no servidor, mas
-- estas políticas deixam o bucket preparado para fluxos client-side futuros.
DROP POLICY IF EXISTS "Admins podem ver avatars" ON storage.objects;
CREATE POLICY "Admins podem ver avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Admins podem inserir o próprio avatar" ON storage.objects;
CREATE POLICY "Admins podem inserir o próprio avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND name LIKE ('admin-profiles/' || auth.uid() || '/%')
  );

DROP POLICY IF EXISTS "Admins podem atualizar o próprio avatar" ON storage.objects;
CREATE POLICY "Admins podem atualizar o próprio avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND name LIKE ('admin-profiles/' || auth.uid() || '/%')
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND name LIKE ('admin-profiles/' || auth.uid() || '/%')
  );

DROP POLICY IF EXISTS "Admins podem remover o próprio avatar" ON storage.objects;
CREATE POLICY "Admins podem remover o próprio avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND name LIKE ('admin-profiles/' || auth.uid() || '/%')
  );

COMMIT;

-- ==============================================================================
-- Próxima etapa sugerida:
-- - mover cooldown de Auth metadata para colunas profile_last_changed_at,
--   avatar_last_changed_at e password_last_changed_at;
-- - criar RPC SECURITY DEFINER para exclusão segura de conta própria;
-- - conectar envio/verificação OTP por e-mail antes de liberar troca de senha.
-- ==============================================================================
