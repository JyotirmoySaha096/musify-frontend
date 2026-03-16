'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './library.module.css';
import { playlistsApi, likedSongsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Card, { CardGrid } from '@/components/Card/Card';
import TrackList from '@/components/TrackList/TrackList';

function LibraryContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'playlists';
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      if (tab === 'liked') {
        likedSongsApi
          .getAll(token)
          .then(setLikedSongs)
          .catch(console.error)
          .finally(() => setLoading(false));
      } else {
        playlistsApi
          .getAll(token)
          .then(setPlaylists)
          .catch(console.error)
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [token, tab]);

  if (!user) {
    return (
      <div className={styles.libraryPage}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3 className={styles.emptyTitle}>Log in to see your library</h3>
          <p className={styles.emptyText}>
            <Link href="/login" style={{ color: 'var(--spotify-green)' }}>
              Log in
            </Link>{' '}
            to create playlists and save your favorite songs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.libraryPage}>
      <div className={styles.libraryHeader}>
        <h1 className={styles.libraryTitle}>Your Library</h1>
        <div className={styles.tabs}>
          <Link
            href="/library"
            className={`${styles.tab} ${tab === 'playlists' ? styles.active : ''}`}
          >
            Playlists
          </Link>
          <Link
            href="/library?tab=liked"
            className={`${styles.tab} ${tab === 'liked' ? styles.active : ''}`}
          >
            Liked Songs
          </Link>
        </div>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading...</div>
      ) : tab === 'liked' ? (
        <>
          <div className={styles.likedHeader}>
            <div className={styles.likedIcon}>♥</div>
            <div className={styles.likedInfo}>
              <h2>Liked Songs</h2>
              <p>{likedSongs.length} songs</p>
            </div>
          </div>
          {likedSongs.length > 0 ? (
            <TrackList tracks={likedSongs} />
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🤍</div>
              <h3 className={styles.emptyTitle}>Songs you like will appear here</h3>
              <p className={styles.emptyText}>
                Save songs by tapping the heart icon.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {playlists.length > 0 ? (
            <CardGrid>
              {playlists.map((pl, i) => (
                <Card
                  key={pl.id}
                  id={pl.id}
                  title={pl.name}
                  subtitle="Playlist"
                  href={`/playlist/${pl.id}`}
                  emoji="🎵"
                  animationDelay={i * 60}
                />
              ))}
            </CardGrid>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎵</div>
              <h3 className={styles.emptyTitle}>Create your first playlist</h3>
              <p className={styles.emptyText}>
                It&apos;s easy, we&apos;ll help you.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px 32px', color: 'var(--text-subdued)' }}>Loading library...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
