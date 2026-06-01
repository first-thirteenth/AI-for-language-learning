// apps/backend/src/models/database.ts
// TypeScript interfaces matching Supabase tables

export interface Profile {
  id: string;
  username: string | null;
  native_language: string;
  target_language: string;
  level: "beginner" | "intermediate" | "advanced";
  avatar_url: string | null;
  streak_days: number;
  total_xp: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  audio_url: string | null;
  created_at: string;
}

export interface VocabularyItem {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  language: string;
  context: string | null;
  times_reviewed: number;
  mastered: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  type: "vocabulary" | "grammar" | "conversation" | "pronunciation";
  content: Record<string, unknown>;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number | null;
  xp_earned: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
