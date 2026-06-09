import type { MoodType } from '../types/mood';

export const MOOD_TYPES: MoodType[] = [
  { key: 'happy', label: '开心', emoji: '😊', color: '#FFD700' },
  { key: 'neutral', label: '一般', emoji: '😐', color: '#B8AECC' },
  { key: 'sad', label: '难过', emoji: '😢', color: '#A0C8E0' },
  { key: 'angry', label: '生气', emoji: '😡', color: '#F4A4B8' },
  { key: 'anxious', label: '焦虑', emoji: '😰', color: '#F5CCA0' },
  { key: 'excited', label: '兴奋', emoji: '🤩', color: '#F0D078' },
  { key: 'tired', label: '疲惫', emoji: '😴', color: '#D4C5F0' },
  { key: 'loved', label: '幸福', emoji: '🥰', color: '#FFD1DC' },
];
