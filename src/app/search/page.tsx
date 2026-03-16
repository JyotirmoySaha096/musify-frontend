'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './search.module.css';
import { searchApi } from '@/lib/api';
import Card, { CardGrid } from '@/components/Card/Card';
import TrackList from '@/components/TrackList/TrackList';
import { usePlayer } from '@/context/PlayerContext';

const GENRE_COLORS = [
  '#e13300', '#1e3264', '#8c67ac', '#1db954',
  '#e8115b', '#148a08', '#509bf5', '#ba5d07',
  '#dc148c', '#27856a', '#056952', '#af2896',
];

const GENRES = [
  { name: 'Pop', emoji: '🎤', color: GENRE_COLORS[0] },
  { name: 'Hip-Hop', emoji: '🎧', color: GENRE_COLORS[1] },
  { name: 'Rock', emoji: '🎸', color: GENRE_COLORS[2] },
  { name: 'Electronic', emoji: '🎹', color: GENRE_COLORS[3] },
  { name: 'R&B', emoji: '🎷', color: GENRE_COLORS[4] },
  { name: 'Jazz', emoji: '🎺', color: GENRE_COLORS[5] },
  { name: 'Classical', emoji: '🎻', color: GENRE_COLORS[6] },
  { name: 'Indie', emoji: '🎶', color: GENRE_COLORS[7] },
  { name: 'Ambient', emoji: '🌊', color: GENRE_COLORS[8] },
  { name: 'Soul', emoji: '💜', color: GENRE_COLORS[9] },
  { name: 'Country', emoji: '🤠', color: GENRE_COLORS[10] },
  { name: 'Latin', emoji: '💃', color: GENRE_COLORS[11] },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ songs: any[]; albums: any[]; artists: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const { playTrack } = usePlayer();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setSearching(true);
    try {
      const data = await searchApi.search(q);
      setResults(data);
    } catch {
      setResults({ songs: [], albums: [], artists: [] });
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <div className={styles.searchInputWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            id="search-input"
          />
        </div>
      </div>

      {!query.trim() && !results && (
        <>
          <h2 className={styles.browseTitle}>Browse All</h2>
          <div className={styles.genreGrid}>
            {GENRES.map((genre) => (
              <div
                key={genre.name}
                className={styles.genreCard}
                style={{ background: genre.color }}
                onClick={() => setQuery(genre.name)}
              >
                {genre.name}
                <span className={styles.genreEmoji}>{genre.emoji}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {query.trim() && results && (
        <>
          {results.songs.length > 0 && (
            <section className={styles.resultSection}>
              <h3 className={styles.resultTitle}>Songs</h3>
              <TrackList tracks={results.songs} showHeader={false} />
            </section>
          )}

          {results.albums.length > 0 && (
            <section className={styles.resultSection}>
              <h3 className={styles.resultTitle}>Albums</h3>
              <CardGrid>
                {results.albums.map((album, i) => (
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
          )}

          {results.artists.length > 0 && (
            <section className={styles.resultSection}>
              <h3 className={styles.resultTitle}>Artists</h3>
              <CardGrid>
                {results.artists.map((artist, i) => (
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
          )}

          {results.songs.length === 0 && results.albums.length === 0 && results.artists.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3 className={styles.emptyTitle}>No results found for &quot;{query}&quot;</h3>
              <p className={styles.emptyText}>
                Please make sure your words are spelled correctly, or use fewer or different keywords.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
