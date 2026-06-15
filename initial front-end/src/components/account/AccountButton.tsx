'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './AccountButton.module.css';

export default function AccountButton() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Link href="/account" className={styles.button} aria-label="Account settings">
      <span className={styles.avatar}>
        {(session.user.username || session.user.name || 'U')[0].toUpperCase()}
      </span>
      <span className={styles.name}>
        {session.user.username || session.user.name || 'Account'}
      </span>
    </Link>
  );
}
