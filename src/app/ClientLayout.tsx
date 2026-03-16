'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import Sidebar from '@/components/Sidebar/Sidebar';
import PlayerBar from '@/components/PlayerBar/PlayerBar';
import styles from './layout.module.css';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className={styles.appLayout}>
          <Sidebar />
          <div className={styles.mainContent}>
            <div className={styles.contentArea}>{children}</div>
          </div>
        </div>
        <PlayerBar />
      </PlayerProvider>
    </AuthProvider>
  );
}
