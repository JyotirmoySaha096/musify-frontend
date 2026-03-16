'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '../../detail.module.css';
import TrackList from '@/components/TrackList/TrackList';
import Card, { CardGrid } from '@/components/Card/Card';
import { artistsApi } from '@/lib/api';
import { usePlayer } from '@/context/PlayerContext';

export default function ArtistPage() {
  const params = useParams();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    if (params.id) {
      artistsApi
        .getOne(params.id as string)
        .then(setArtist)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return <div className={styles.loading}>Loading artist...</div>;
  }

  if (!artist) {
    return <div className={styles.loading}>Artist not found</div>;
  }

  // Flatten all songs from albums for "Popular" section
  const allSongs = artist.songs || [];

  const handlePlayAll = () => {
    if (allSongs.length > 0) {
      playTrack(allSongs[0], allSongs, 0);
    }
  };

  return (
    <div className={styles.detailPage}>
      <div className={styles.heroPurple}>
        <div className={styles.coverArtRound}>🎤</div>
        <div className={styles.heroInfo}>
          <div className={styles.heroType}>Artist</div>
          <h1 className={styles.heroTitle}>{artist.name}</h1>
          {artist.bio && <p className={styles.heroBio}>{artist.bio}</p>}
        </div>
      </div>

      <div className={styles.controlsBar}>
        <button className={styles.bigPlayBtn} onClick={handlePlayAll}>
          ▶
        </button>
      </div>

      <div className={styles.trackSection}>
        {allSongs.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Popular</h2>
            <TrackList tracks={allSongs.slice(0, 5)} showHeader={false} />
          </>
        )}

        {artist.albums?.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Discography</h2>
            <CardGrid>
              {artist.albums.map((album: any, i: number) => (
                <Card
                  key={album.id}
                  id={album.id}
                  title={album.title}
                  subtitle={`${album.releaseYear || ''} · Album`}
                  href={`/album/${album.id}`}
                  emoji="💿"
                  animationDelay={i * 60}
                />
              ))}
            </CardGrid>
          </>
        )}
      </div>
    </div>
  );
}
