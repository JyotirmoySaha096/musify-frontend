'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Card.module.css';

interface CardProps {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  emoji?: string;
  round?: boolean;
  onPlay?: () => void;
  animationDelay?: number;
}

export default function Card({
  title,
  subtitle,
  href,
  emoji = '🎵',
  round = false,
  onPlay,
  animationDelay = 0,
}: CardProps) {
  return (
    <Link
      href={href}
      className={styles.card}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className={styles.coverWrapper}>
        <div className={round ? styles.coverRound : styles.cover}>
          {emoji}
        </div>
        {onPlay && (
          <button
            className={styles.playButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPlay();
            }}
          >
            ▶
          </button>
        )}
      </div>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardSubtitle}>{subtitle}</div>
    </Link>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.cardGrid}>{children}</div>;
}
