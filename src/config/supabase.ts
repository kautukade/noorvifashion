import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * ─────────────────────────────────────────────────────────────
 *  SUPABASE CONNECTION (Journal / Blog system)
 *
 *  The site runs in two modes:
 *
 *  1. DEMO MODE (default) — no keys configured. Blog data lives in
 *     the browser (localStorage) so the whole experience works
 *     out of the box for presentations.
 *
 *  2. LIVE MODE — set these environment variables (e.g. in a .env
 *     file or on Netlify) and the Journal automatically switches
 *     to the Supabase database, storage buckets and real auth:
 *
 *        VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
 *        VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 *  Then run supabase/schema.sql in the SQL editor to create the
 *  tables, RLS policies and storage buckets.
 *
 *  The SDK itself is imported lazily, so demo visitors never
 *  download it.
 * ─────────────────────────────────────────────────────────────
 */
const url = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/** True when real Supabase credentials are present. */
export const isSupabaseReady = Boolean(url && anonKey);

let clientPromise: Promise<SupabaseClient | null> | null = null;

/** Lazily create (and cache) the Supabase client. Resolves null in demo mode. */
export function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseReady) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(url, anonKey)
    );
  }
  return clientPromise;
}

/* ───────────────────────── Auth ───────────────────────── */

/** Sign in with email + password (Supabase Auth). Returns an error message or null. */
export async function supaSignIn(email: string, password: string): Promise<string | null> {
  const supabase = await getSupabase();
  if (!supabase) return "Supabase is not configured — demo login is active.";
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function supaSignOut(): Promise<void> {
  const supabase = await getSupabase();
  await supabase?.auth.signOut();
}

/** True if a real Supabase session exists (used to restore admin login). */
export async function supaHasSession(): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}
