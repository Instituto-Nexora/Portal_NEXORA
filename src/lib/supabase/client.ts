import { createBrowserClient } from "@supabase/ssr";

function getBrowserSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
  }

  return { anonKey, supabaseUrl };
}

export function createClient() {
  const { anonKey, supabaseUrl } = getBrowserSupabaseEnv();

  return createBrowserClient(supabaseUrl, anonKey);
}
