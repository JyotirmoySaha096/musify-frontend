'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '../../detail.module.css';
import TrackList from '@/components/TrackList/TrackList';
import { playlistsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function PlaylistPage() {
  const params = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    if (params.id) {
      playlistsApi
        .getOne(params.id as string)
        .then(setPlaylist)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className={styles.loading}>Playlist not found</div>;
  }

  const songs = playlist.playlistSongs?.map((ps: any) => ps.song).filter(Boolean) || [];

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playTrack(songs[0], songs, 0);
    }
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.heroGreen}>
        <div className={styles.coverArt}>🎵</div>
        <div className={styles.heroInfo}>
          <div className={styles.heroType}>Playlist</div>
          <h1 className={styles.heroTitle}>{playlist.name}</h1>
          <div className={styles.heroMeta}>
            <span>{playlist.user?.username || 'User'}</span>
            <span className={styles.dot} />
            <span>{songs.length} songs</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <button className={styles.bigPlayBtn} onClick={handlePlayAll}>
          ▶
        </button>
      </div>

      <div className={styles.trackSection}>
        {songs.length > 0 ? (
          <TrackList tracks={songs} />
        ) : (
          <div className={styles.loading}>
            This playlist is empty. Search for songs to add!
          </div>
        )}
      </div>
    </div>
  );
}
