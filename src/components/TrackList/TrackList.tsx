'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TrackList.module.css';
import { usePlayer } from '@/context/PlayerContext';

interface Track {
  id: string;
  title: string;
  durationSeconds: number;
  trackNumber?: number;
  artist: { id: string; name: string };
  album: { id: string; title: string; coverUrl: string };
}

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  showHeader?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TrackList({
  tracks,
  showAlbum = true,
  showHeader = true,
}: TrackListProps) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const handlePlayTrack = (track: Track, index: number) => {
    playTrack(track, tracks, index);
  };

  return (
    <div className={styles.trackList}>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerCell}>#</div>
          <div className={styles.headerCell}>Title</div>
          {showAlbum && <div className={styles.headerCell}>Album</div>}
          <div className={styles.headerCell}>⏱</div>
        </div>
      )}
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;

        return (
          <div
            key={track.id}
            className={isCurrent ? styles.trackPlaying : styles.track}
            onClick={() => handlePlayTrack(track, index)}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className={styles.trackNumber}>
              {isCurrent && isPlaying ? (
                <span style={{ color: 'var(--spotify-green)' }}>♫</span>
              ) : (
                <>
                  <span>{index + 1}</span>
                  <span className={styles.playIndicator}>▶</span>
                </>
              )}
            </div>

            <div className={styles.songInfo}>
              <div className={styles.songCover}>🎵</div>
              <div className={styles.songDetails}>
                <div className={styles.songTitle}>{track.title}</div>
                <Link
                  href={`/artist/${track.artist?.id}`}
                  className={styles.songArtist}
                  onClick={(e) => e.stopPropagation()}
                >
                  {track.artist?.name}
                </Link>
              </div>
            </div>

            {showAlbum && (
              <Link
                href={`/album/${track.album?.id}`}
                className={styles.albumName}
                onClick={(e) => e.stopPropagation()}
              >
                {track.album?.title}
              </Link>
            )}

            <div className={styles.duration}>
              {formatDuration(track.durationSeconds)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
