-- ==============================================================================
-- MIGRATION: 00007_fix_auth_trigger_admin
-- Atualiza handle_new_user para não criar student_profiles para admins CMS.
-- O admin cria seu próprio perfil via INSERT em profiles na action criarAdmin.
-- ==============================================================================

-- UP
BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF (NEW.raw_user_meta_data->>'is_cms_admin' IS DISTINCT FROM 'true') THEN
    INSERT INTO public.student_profiles (id, full_name, email)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- ==============================================================================
-- DOWN (reversão)
-- ==============================================================================
/*
BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.student_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
*/
