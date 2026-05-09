-- ==============================================================================
-- MIGRATION: 00002_cadastro_auth_trigger
-- ==============================================================================

-- UP
BEGIN;

-- Função para automatizar a criação do perfil do aluno a partir do Supabase Auth
-- Justificativa: Garante a consistência relacional. A inserção na tabela de 
-- perfis não fica dependente da aplicação (evita contas criadas sem perfis por falha de rede).
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

-- Trigger na tabela auth.users (gerenciada pelo Supabase)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;

-- ==============================================================================
-- DOWN (reversão)
-- ==============================================================================
/*
BEGIN;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
COMMIT;
*/
