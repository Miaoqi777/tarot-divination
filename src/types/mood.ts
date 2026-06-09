export interface MoodEntry {
  date: string;      // ISO date string YYYY-MM-DD
  mood: string;      // mood type key
  emoji: string;     // emoji
  note: string;      // optional note
  timestamp: number;
}

export interface MoodType {
  key: string;
  label: string;
  emoji: string;
  color: string;
}
