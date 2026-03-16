'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { albumsApi, artistsApi, songsApi } from '@/lib/api';
import Card, { CardGrid } from '@/components/Card/Card';
import { usePlayer } from '@/context/PlayerContext';

export default function HomePage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    Promise.all([
      albumsApi.getAll(8),
      artistsApi.getAll(6),
      songsApi.getAll(6),
    ])
      .then(([a, ar, s]) => {
        setAlbums(a);
        setArtists(ar);
        setSongs(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className={styles.home}>
        <div className={styles.loading}>Loading your music...</div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <h1 className={styles.greeting}>{getGreeting()}</h1>

      {/* Quick Play Grid */}
      {albums.length > 0 && (
        <div className={styles.quickPlayGrid}>
          {albums.slice(0, 6).map((album) => (
            <Link
              key={album.id}
              href={`/album/${album.id}`}
              className={styles.quickPlayCard}
            >
              <div className={styles.quickPlayCover}>💿</div>
              <span className={styles.quickPlayTitle}>{album.title}</span>
              <div className={styles.quickPlayBtn}>▶</div>
            </Link>
          ))}
        </div>
      )}

      {/* Featured Albums */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Albums</h2>
          <Link href="/search" className={styles.seeAll}>
            Show All
          </Link>
        </div>
        <CardGrid>
          {albums.map((album, i) => (
            <Card
              key={album.id}
              id={album.id}
              title={album.title}
              subtitle={album.artist?.name || 'Unknown Artist'}
              href={`/album/${album.id}`}
              emoji="💿"
              animationDelay={i * 60}
            />
          ))}
        </CardGrid>
      </section>

      {/* Artists */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Artists</h2>
          <Link href="/search" className={styles.seeAll}>
            Show All
          </Link>
        </div>
        <CardGrid>
          {artists.map((artist, i) => (
            <Card
              key={artist.id}
              id={artist.id}
              title={artist.name}
              subtitle="Artist"
              href={`/artist/${artist.id}`}
              emoji="🎤"
              round
              animationDelay={i * 60}
            />
          ))}
        </CardGrid>
      </section>

      {/* Recently Added Songs */}
      {songs.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tracks For You</h2>
          </div>
          <CardGrid>
            {songs.map((song, i) => (
              <Card
                key={song.id}
                id={song.id}
                title={song.title}
                subtitle={song.artist?.name || 'Unknown Artist'}
                href={`/album/${song.album?.id}`}
                emoji="🎵"
                onPlay={() => playTrack(song, songs, i)}
                animationDelay={i * 60}
              />
            ))}
          </CardGrid>
        </section>
      )}
    </div>
  );
}
