'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import styles from './Profile.module.scss';

type UpdateItem = {
  animeId: number;
  progress: number;
};

type AnimeDetail = {
  title: string;
  images: { jpg: { image_url: string } };
};

type EnrichedUpdate = UpdateItem & AnimeDetail;

const ProfileView = () => {
  const [userStats, setUserStats] = useState<{
    username: string;
    totalAnime: number;
    totalEpisodesWatched: number;
  } | null>(null);

  const [updates, setUpdates] = useState<EnrichedUpdate[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/userstats');
        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);
          return;
        }

        setUserStats({
          username: data.username,
          totalAnime: data.totalAnime,
          totalEpisodesWatched: data.totalEpisodesWatched,
        });

        const animeDetails = await Promise.all(
          data.lastUpdates.map(async (item: UpdateItem) => {
            try {
              const animeRes = await fetch(`https://api.jikan.moe/v4/anime/${item.animeId}`);
              const animeData = await animeRes.json();
              return {
                ...item,
                title: animeData.data.title,
                images: animeData.data.images,
              };
            } catch (err) {
              console.error(`Failed to fetch anime ${item.animeId}`, err);
              return null;
            }
          })
        );

        setUpdates(animeDetails.filter(Boolean) as EnrichedUpdate[]);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      signOut({ callbackUrl: '/auth/login' });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/pages/home" className={styles.icon__backButton}>
          <div className={styles.icon__backButton}>
            <i className="bx bx-chevron-left-circle"></i>
          </div>
        </Link>
        <h1 className={styles.title}>My Profile</h1>
      </header>

      <section className={styles.profileSection}>
        <div className={styles.profileImage}>
          <Image
            src="/testImage.png" 
            alt="Profile Picture" 
            width={160} 
            height={160} 
            style={{ borderRadius: '50%' }}
                />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.username}>{userStats?.username ?? 'Loading...'}</h2>
          <div className={styles.statsBox}>
            <div className={styles.stat}>
              <div className={styles.statIcon}><i className="bx bx-book"></i></div>
              <div className={styles.statText}>
                <p className={styles.statNumber}>{userStats?.totalAnime ?? 0}</p>
                <p className={styles.statLabel}>On Listed</p>
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statIcon}><i className="bx bx-film"></i></div>
              <div className={styles.statText}>
                <p className={styles.statNumber}>{userStats?.totalEpisodesWatched ?? 0}</p>
                <p className={styles.statLabel}>Total Episode</p>
              </div>
            </div>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="bx bx-door"></i>
        </button>
      </section>

      <section className={styles.updatesSection}>
        <h2 className={styles.updatesTitle}>Last Updates</h2>
        <div className={styles.animeGrid}>
          {updates.map((anime, idx) => (
            <div key={idx} className={styles.animeCard}>
              <Image
                src={anime.images.jpg.image_url}
                alt={anime.title}
                width={200}
                height={300}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
              <p>{anime.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileView;
