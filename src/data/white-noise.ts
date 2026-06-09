import type { AudioTrack } from '../types/audio';

export const AUDIO_TRACKS: AudioTrack[] = [
  { id: 'rain', name: 'Rain', nameZh: '雨声', emoji: '🌧️', file: '/audio/rain.mp3', color: '#A0C8E0' },
  { id: 'ocean', name: 'Ocean Waves', nameZh: '海浪', emoji: '🌊', file: '/audio/ocean.mp3', color: '#8FD4B0' },
  { id: 'forest', name: 'Forest', nameZh: '森林', emoji: '🌲', file: '/audio/forest.mp3', color: '#B8E8D0' },
  { id: 'fireplace', name: 'Fireplace', nameZh: '壁炉', emoji: '🔥', file: '/audio/fireplace.mp3', color: '#F5CCA0' },
  { id: 'white-noise', name: 'White Noise', nameZh: '白噪音', emoji: '💨', file: '/audio/white-noise.mp3', color: '#D4C5F0' },
  { id: 'brown-noise', name: 'Brown Noise', nameZh: '棕噪音', emoji: '🍂', file: '/audio/brown-noise.mp3', color: '#FFE4C8' },
];
