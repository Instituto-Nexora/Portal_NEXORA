CREATE TABLE student_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enrollments_student_id ON enrollments(user_id);
CREATE INDEX idx_courses_is_published ON courses(is_published);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);