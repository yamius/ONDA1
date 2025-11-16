import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserGameProgress = {
  id: string;
  user_id: string;
  ond: number;
  active_circuit: number;
  completed_practices: Record<string, any>;
  practice_history: any[];
  artifacts: any[];
  unlocked_achievements: any[];
  bio_metrics: Record<string, any>;
  sleep_tracking: {
    day: number;
    lastCheck: string | null;
  };
  selected_language: string;
  selected_level: number;
  selected_chapter: number;
  is_light_theme: boolean;
  created_at: string;
  updated_at: string;
};
