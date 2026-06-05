import { createClient } from "@supabase/supabase-js";

function getAdminSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return { serviceRoleKey, supabaseUrl };
}

export function createAdminClient() {
  const { serviceRoleKey, supabaseUrl } = getAdminSupabaseEnv();

  return createClient(supabaseUrl, serviceRoleKey);
}
