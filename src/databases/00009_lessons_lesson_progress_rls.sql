BEGIN;

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Alunos só veem aulas publicadas de cursos em que estão matriculados.
-- CMS (createAdminClient — service role) ignora RLS e continua vendo tudo.
CREATE POLICY "Alunos matriculados podem ver aulas publicadas"
  ON public.lessons
  FOR SELECT
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = lessons.course_id
        AND e.user_id = auth.uid()
    )
  );

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- O aluno só vê o próprio progresso
CREATE POLICY "Alunos podem ver o próprio progresso"
  ON public.lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- O aluno só pode registrar progresso em nome dele mesmo
CREATE POLICY "Alunos podem registrar o próprio progresso"
  ON public.lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Necessário para o upsert (onConflict: user_id,lesson_id) em marcarAulaConcluida
CREATE POLICY "Alunos podem atualizar o próprio progresso"
  ON public.lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

COMMIT;
