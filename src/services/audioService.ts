import { Howl } from 'howler';

let currentHowl: Howl | null = null;

/** Play a white noise audio track */
export function playAudio(src: string, volume: number = 0.5, loop: boolean = true): Howl {
  // Stop any currently playing audio
  if (currentHowl) {
    currentHowl.stop();
    currentHowl.unload();
  }

  currentHowl = new Howl({
    src: [src],
    html5: true,
    loop,
    volume,
    format: ['mp3'],
  });

  currentHowl.play();
  return currentHowl;
}

/** Pause current audio */
export function pauseAudio(): void {
  currentHowl?.pause();
}

/** Resume current audio */
export function resumeAudio(): void {
  currentHowl?.play();
}

/** Set volume */
export function setAudioVolume(volume: number): void {
  currentHowl?.volume(volume);
}

/** Stop and unload audio */
export function stopAudio(): void {
  if (currentHowl) {
    currentHowl.stop();
    currentHowl.unload();
    currentHowl = null;
  }
}

/** Check if audio is currently playing */
export function isAudioPlaying(): boolean {
  return currentHowl?.playing() ?? false;
}
