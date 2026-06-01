// apps/mobile/types/index.ts
export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ja"
  | "zh"
  | "ko"
  | "ru";
export type Level = "beginner" | "intermediate" | "advanced";
export type MessageRole = "user" | "assistant";
export type LessonType =
  | "vocabulary"
  | "grammar"
  | "conversation"
  | "pronunciation";

export interface Profile {
  id: string;
  username: string | null;
  native_language: Language;
  target_language: Language;
  level: Level;
  avatar_url: string | null;
  streak_days: number;
  total_xp: number;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  language: Language;
  level: Level;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  audio_url: string | null;
  created_at: string;
}
