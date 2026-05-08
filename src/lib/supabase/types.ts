type AdminRole = "admin" | "content_creator" | "professor";

type AdminProfile = {
  id: string;
  user_id: string;
  full_name: string;
  role: AdminRole;
  avatar_url: string | null;
  created_at: string;
};

type student_profiles = {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
}

type Tables = {
  student_profiles: student_profiles
}

type SessionUser = {
  id: string;
  email: string;
  profile: AdminProfile;
};

type ActionState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export type { AdminRole, AdminProfile, Tables, SessionUser, ActionState }
