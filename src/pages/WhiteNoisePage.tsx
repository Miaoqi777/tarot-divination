import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { pauseAudio, resumeAudio, setAudioVolume, stopAudio } from '../services/audioService';
import { AUDIO_TRACKS } from '../data/white-noise';
import GlassCard from '../components/ui/GlassCard';

export default function WhiteNoisePage() {
  const { currentTrackId, isPlaying, volume, setTrack, setPlaying, setVolume } = useAudioStore();

  const handlePlay = useCallback((trackId: string) => {
    if (currentTrackId === trackId && isPlaying) {
      pauseAudio();
      setPlaying(false);
    } else if (currentTrackId === trackId) {
      resumeAudio();
      setPlaying(true);
    } else {
      const track = AUDIO_TRACKS.find((t) => t.id === trackId);
      if (track) {
        stopAudio();
        // Since we don't have actual audio files, simulate the player
        setTrack(trackId);
        setPlaying(true);
        // When real files exist: howlRef.current = playAudio(track.file, volume);
      }
    }
  }, [currentTrackId, isPlaying, setTrack, setPlaying, volume]);

  const handleVolume = useCallback((v: number) => {
    setVolume(v);
    setAudioVolume(v);
  }, [setVolume]);

  return (
    <div className="flex flex-col gap-4 px-2 pb-20" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center', marginBottom: 4 }}>
        白噪音陪伴 🎵
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8 }}>
        选择一段自然之声，让它陪伴你的每一刻
      </p>

      {/* Track grid */}
      <div className="grid grid-cols-2 gap-3">
        {AUDIO_TRACKS.map((track) => {
          const isActive = currentTrackId === track.id && isPlaying;
          return (
            <motion.button
              key={track.id}
              onClick={() => handlePlay(track.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer"
              style={{
                background: isActive ? `${track.color}30` : 'var(--glass-bg)',
                border: `1px solid ${isActive ? track.color : 'var(--glass-border)'}`,
                boxShadow: isActive ? `0 4px 20px ${track.color}30` : 'none',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span style={{ fontSize: 40 }}>{track.emoji}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                {track.nameZh}
              </span>
              {isActive ? (
                <Pause size={20} color="var(--text-primary)" />
              ) : (
                <Play size={20} color="var(--text-secondary)" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Volume control */}
      {currentTrackId && (
        <GlassCard className="p-4 flex items-center gap-3">
          <Volume2 size={20} color="var(--text-secondary)" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolume(parseFloat(e.target.value))}
            className="flex-1"
            style={{ accentColor: 'var(--macaron-lavender-deep)' }}
          />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 40 }}>
            {Math.round(volume * 100)}%
          </span>
        </GlassCard>
      )}

      {/* Info */}
      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
        提示：白噪音会在你切换到其他页面时继续播放。底部会显示迷你播放器方便随时控制。
      </p>
    </div>
  );
}
