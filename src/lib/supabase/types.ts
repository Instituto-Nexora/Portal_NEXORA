type AdminRole = "admin" | "content_creator" | "professor" | "aluno";

type AdminProfile = {
  id: string;
  user_id: string;
  full_name: string;
  role: AdminRole;
  avatar_url: string | null;
  created_at: string;
};

type StudentProfile = AdminProfile & {
  email: string;
  role: "aluno"
}

type SessionUser = {
  id: string;
  email: string;
  profile: AdminProfile | StudentProfile | null;
};

type ActionState =
  | {
      success?: boolean;
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

type EventType = "ao_vivo" | "gravado";
type EventStatus = "draft" | "published" | "archived";

type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  type: EventType;
  status: EventStatus;
  scheduled_at: string | null;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  youtube_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type TicketTopic = "aula" | "cadastro" | "curso" | "eventos" | "reclamacao";
type TicketStatus = "aberto" | "em_progresso" | "finalizado";

type Ticket = {
  id: string;
  aluno_id: string;
  topico: TicketTopic;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
};

type TicketMessage = {
  id: string;
  ticket_id: string;
  autor_id: string;
  autor_role: "student" | AdminRole;
  mensagem: string;
  created_at: string;
  lida: boolean;
};

type Curso = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  price_cents: number;
  is_published: boolean;
  created_at: string;
};

type Aula = {
  id: string;
  course_id: string;
  title: string;
  video_url: string | null;
  position: number;
  duration_seconds: number | null;
  is_published: boolean;
  created_at: string;
};

type LessonStatus = "published" | "draft";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  order: number;
  status: LessonStatus;
  created_at: string;
};

type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
};

type ProgressResult = {
  concluidas: number;
  total: number;
  percentual: number;
};

export type {
  Curso,
  Aula,
  AdminRole,
  AdminProfile,
  StudentProfile,
  SessionUser,
  ActionState,
  EventType,
  EventStatus,
  Event,
  TicketTopic,
  TicketStatus,
  Ticket,
  TicketMessage,
  LessonStatus,
  Lesson,
  LessonProgress,
  ProgressResult,
};
