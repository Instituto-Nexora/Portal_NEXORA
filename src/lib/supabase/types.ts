type AdminRole = "admin" | "content_creator" | "professor";

type AdminProfile = {
  id: string;
  user_id: string;
  full_name: string;
  role: AdminRole;
  avatar_url: string | null;
  created_at: string;
};

type StudentProfile = {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  created_at: string
}

type SessionUser = {
  id: string;
  email: string;
  profile: AdminProfile;
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

export type {
  AdminRole,
  AdminProfile,
  StudentProfile,
  SessionUser,
  ActionState,
  EventType,
  EventStatus,
  Event,
};
