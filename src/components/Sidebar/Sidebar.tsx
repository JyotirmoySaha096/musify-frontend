'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import { useAuth } from '@/context/AuthContext';
import { playlistsApi } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      playlistsApi.getAll(token).then(setPlaylists).catch(() => {});
    }
  }, [token]);

  const handleCreatePlaylist = async () => {
    if (!token) return;
    const name = `My Playlist #${playlists.length + 1}`;
    try {
      const newPlaylist = await playlistsApi.create(token, { name });
      setPlaylists((prev) => [newPlaylist, ...prev]);
    } catch (err) {
      console.error('Failed to create playlist', err);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>♪</div>
        <span className={styles.logoText}>Spotify</span>
      </div>

      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
          <span className={styles.navIcon}>🏠</span>
          Home
        </Link>
        <Link href="/search" className={`${styles.navItem} ${pathname === '/search' ? styles.active : ''}`}>
          <span className={styles.navIcon}>🔍</span>
          Search
        </Link>
        {user && (
          <Link href="/library" className={`${styles.navItem} ${pathname === '/library' ? styles.active : ''}`}>
            <span className={styles.navIcon}>📚</span>
            Your Library
          </Link>
        )}
      </nav>

      <div className={styles.divider} />

      {user ? (
        <>
          <div className={styles.libraryHeader}>
            <button className={styles.libraryTitle}>
              <span>📚</span> Your Library
            </button>
            <button className={styles.createBtn} onClick={handleCreatePlaylist} title="Create playlist">
              +
            </button>
          </div>

          <div className={styles.playlistList}>
            <Link href="/library?tab=liked" className={styles.playlistItem}>
              <div className={`${styles.playlistCover} ${styles.likedSongsGradient}`}>
                ♥
              </div>
              <div className={styles.playlistInfo}>
                <div className={styles.playlistName}>Liked Songs</div>
                <div className={styles.playlistMeta}>Playlist</div>
              </div>
            </Link>

            {playlists.map((pl) => (
              <Link key={pl.id} href={`/playlist/${pl.id}`} className={styles.playlistItem}>
                <div className={styles.playlistCover}>🎵</div>
                <div className={styles.playlistInfo}>
                  <div className={styles.playlistName}>{pl.name}</div>
                  <div className={styles.playlistMeta}>Playlist</div>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.userSection}>
            <button className={styles.userBtn} onClick={logout}>
              <div className={styles.userAvatar}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              {user.username}
            </button>
          </div>
        </>
      ) : (
        <div className={styles.userSection}>
          <Link href="/login" className={styles.userBtn}>
            Log in
          </Link>
        </div>
      )}
    </aside>
  );
}
