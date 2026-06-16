import { createAdminClient } from "@/lib/supabase/admin";

type LogAccessParams = {
  studentId?: string;
  resourceType: "course" | "event" | "page";
  resourceId?: string;
  resourceSlug?: string;
};

export async function logAccess({
  studentId,
  resourceType,
  resourceId,
  resourceSlug,
}: LogAccessParams): Promise<void> {
  try {
    const adminClient = createAdminClient();
    const { error } = await adminClient.from("access_logs").insert({
      student_id: studentId ?? null,
      resource_type: resourceType,
      resource_id: resourceId ?? null,
      resource_slug: resourceSlug ?? null,
    });
    if (error) {
      console.error("[logAccess] insert error:", error.message, error.details);
    }
  } catch (err) {
    console.error("[logAccess] unexpected error:", err);
  }
}
