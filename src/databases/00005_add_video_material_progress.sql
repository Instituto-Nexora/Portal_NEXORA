-- Adiciona colunas para progresso granular (vídeo + material)
ALTER TABLE public.lesson_progress
  ADD COLUMN video_completed_at timestamptz,
  ADD COLUMN material_completed_at timestamptz;

-- Backfill: registros existentes viram "vídeo completo"
UPDATE public.lesson_progress
SET video_completed_at = completed_at
WHERE completed_at IS NOT NULL;
