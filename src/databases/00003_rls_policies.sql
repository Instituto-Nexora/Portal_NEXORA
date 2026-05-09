-- ==============================================================================
-- MIGRATION: 00003_rls_policies (Políticas de Segurança - Row Level Security)
-- ==============================================================================

BEGIN;

-- ==========================================
-- 1. Políticas para PERFIL DO ALUNO
-- ==========================================
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- O aluno só pode ler a linha que tem o ID igual ao ID dele no token de Autenticação
CREATE POLICY "Alunos podem ver apenas o próprio perfil"
  ON public.student_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- O aluno só pode editar o próprio nome/avatar, nunca o de terceiros
CREATE POLICY "Alunos podem atualizar apenas o próprio perfil"
  ON public.student_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ==========================================
-- 2. Políticas para CURSOS
-- ==========================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa (ou aluno logado) pode listar os cursos, DESDE QUE estejam publicados
CREATE POLICY "Todos podem ver cursos publicados"
  ON public.courses
  FOR SELECT
  USING (is_published = true);

-- ==========================================
-- 3. Políticas para MATRÍCULAS E PROGRESSO
-- ==========================================
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- O aluno só vê o progresso e as matrículas dele próprio
CREATE POLICY "Alunos podem ver apenas as próprias matrículas"
  ON public.enrollments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Quando o aluno assiste uma aula, ele só pode atualizar o próprio progresso
CREATE POLICY "Alunos podem atualizar o próprio progresso"
  ON public.enrollments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- O aluno só pode criar uma matrícula no próprio nome
CREATE POLICY "Alunos podem se matricular"
  ON public.enrollments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

COMMIT;