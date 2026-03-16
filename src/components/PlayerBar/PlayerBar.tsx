'use client';

import React from 'react';
import Link from 'next/link';
import styles from './PlayerBar.module.css';
import { usePlayer } from '@/context/PlayerContext';

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <div className={styles.playerEmpty}>
        <div className={styles.emptyText}>Select a song to start listening</div>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  const volumeIcon = volume === 0 ? '🔇' : volume < 0.3 ? '🔈' : volume < 0.7 ? '🔉' : '🔊';

  return (
    <div className={styles.player}>
      {/* Left: Track Info */}
      <div className={styles.trackInfo}>
        <div className={styles.albumArt}>🎵</div>
        <div className={styles.trackDetails}>
          <div className={styles.trackTitle}>{currentTrack.title}</div>
          <Link
            href={`/artist/${currentTrack.artist?.id}`}
            className={styles.trackArtist}
          >
            {currentTrack.artist?.name}
          </Link>
        </div>
        <button className={styles.likeBtn}>🤍</button>
      </div>

      {/* Center: Controls */}
      <div className={styles.controls}>
        <div className={styles.controlButtons}>
          <button
            className={`${styles.controlBtn} ${shuffle ? styles.active : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            🔀
          </button>
          <button className={styles.controlBtn} onClick={previous} title="Previous">
            ⏮
          </button>
          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button className={styles.controlBtn} onClick={next} title="Next">
            ⏭
          </button>
          <button
            className={`${styles.controlBtn} ${repeat !== 'off' ? styles.active : ''}`}
            onClick={toggleRepeat}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? '🔂' : '🔁'}
          </button>
        </div>

        <div className={styles.progressSection}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <div className={styles.progressBar} onClick={handleProgressClick}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className={styles.volumeSection}>
        <button
          className={styles.volumeBtn}
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
        >
          {volumeIcon}
        </button>
        <div className={styles.volumeBar} onClick={handleVolumeClick}>
          <div className={styles.volumeFill} style={{ width: `${volume * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
