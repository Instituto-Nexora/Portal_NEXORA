-- RLS Policies para lessons e lesson_progress
-- As tabelas existem mas não têm políticas de SELECT para usuários autenticados.

-- 1. lessons: alunos autenticados podem ver apenas aulas publicadas de cursos publicados
CREATE POLICY "Alunos podem ver aulas publicadas de cursos publicados"
  ON public.lessons
  FOR SELECT
  TO authenticated
  USING (
    lessons.is_published = true
    AND
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = lessons.course_id
      AND courses.is_published = true
    )
  );

-- 2. lesson_progress: alunos podem ver apenas seu próprio progresso
CREATE POLICY "Alunos podem ver próprio progresso"
  ON public.lesson_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 3. lesson_progress: alunos podem inserir próprio progresso
CREATE POLICY "Alunos podem inserir próprio progresso"
  ON public.lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 4. lesson_progress: alunos podem atualizar próprio progresso (usado pelo upsert)
CREATE POLICY "Alunos podem atualizar próprio progresso"
  ON public.lesson_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
