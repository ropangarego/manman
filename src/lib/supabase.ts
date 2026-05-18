import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

function hasPasswordRecoveryMarker() {
  if (typeof window === 'undefined') {
    return false;
  }

  const recoveryText = `${window.location.search}&${window.location.hash}`;
  return (
    recoveryText.includes('type=recovery') ||
    recoveryText.includes('PASSWORD_RECOVERY') ||
    recoveryText.includes('recovery=1')
  );
}

export const initialPasswordRecoveryUrl = hasPasswordRecoveryMarker();

export const isSupabaseConfigured =
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  supabaseUrl !== 'your_project_url' &&
  supabaseAnonKey !== 'your_anon_key';

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export type SupabaseUser = User;

export function displayNameFromUser(user: User) {
  const metadataName = user.user_metadata?.display_name;
  if (typeof metadataName === 'string' && metadataName.trim().length > 0) {
    return metadataName.trim();
  }

  return user.email?.split('@')[0] || 'Learner';
}
