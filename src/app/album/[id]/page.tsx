'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../detail.module.css';
import TrackList from '@/components/TrackList/TrackList';
import { albumsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    if (params.id) {
      albumsApi
        .getOne(params.id as string)
        .then(setAlbum)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>Loading album...</div>;
  }

  if (!album) {
    return <div className={styles.loading}>Album not found</div>;
  }

  const handlePlayAll = () => {
    if (album.songs?.length > 0) {
      playTrack(album.songs[0], album.songs, 0);
    }
  };

  const totalDuration = album.songs?.reduce(
    (sum: number, s: any) => sum + s.durationSeconds,
    0,
  );
  const mins = Math.floor(totalDuration / 60);

  return (
    <div className={styles.detailPage}>
      <div className={styles.hero}>
        <div className={styles.coverArt}>💿</div>
        <div className={styles.heroInfo}>
          <div className={styles.heroType}>Album</div>
          <h1 className={styles.heroTitle}>{album.title}</h1>
          <div className={styles.heroMeta}>
            <Link href={`/artist/${album.artist?.id}`}>
              {album.artist?.name}
            </Link>
            <span className={styles.dot} />
            <span>{album.releaseYear}</span>
            <span className={styles.dot} />
            <span>{album.songs?.length || 0} songs, ~{mins} min</span>
          </div>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <button className={styles.bigPlayBtn} onClick={handlePlayAll}>
          ▶
        </button>
      </div>

      <div className={styles.trackSection}>
        <TrackList tracks={album.songs || []} showAlbum={false} />
      </div>
    </div>
  );
}
