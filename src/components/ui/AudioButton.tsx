import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Volume2 } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';

interface AudioButtonProps {
  audioSrc?: string;
  label?: string;
  disabled?: boolean;
  variant?: 'inline' | 'centeredBelow';
  className?: string;
  onPlay?: () => void | Promise<void>;
}

export function AudioButton({
  audioSrc,
  label = 'Play pronunciation',
  disabled = false,
  variant = 'inline',
  className = '',
  onPlay,
}: AudioButtonProps) {
  const soundEnabled = useAppStore((state) => state.settings.sound);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canPlay = Boolean(audioSrc || onPlay) && !disabled && soundEnabled;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const playFromSource = () =>
    new Promise<void>((resolve, reject) => {
      if (!audioSrc) {
        resolve();
        return;
      }

      audioRef.current?.pause();
      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed.'));
      audio.play().catch(reject);
    });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!canPlay || isPlaying) {
      return;
    }

    setIsPlaying(true);

    try {
      if (audioSrc) {
        await playFromSource();
      } else {
        await onPlay?.();
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      className={`audio-button audio-button-${variant}${isPlaying ? ' playing' : ''} ${className}`.trim()}
      type="button"
      aria-label={label}
      disabled={!canPlay}
      onClick={handleClick}
    >
      <Volume2 aria-hidden="true" />
    </button>
  );
}
