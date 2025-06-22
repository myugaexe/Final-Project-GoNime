'use client';

import { useEffect, useState } from 'react';
import styles from './List.module.scss';
import Link from 'next/link';

type Anime = {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  studios: { name: string }[];
  aired: { string: string };
};

const ListView = () => {
  const [activeFilter, setActiveFilter] = useState('currently watching');
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  const filters = [
    'currently watching',
    'completed',
    'on hold',
    'dropped',
    'plan to watch',
  ];

  useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=10`);
        const data = await res.json();
        setAnimeList(data.data);
      } catch (err) {
        console.error('Failed to fetch anime list:', err);
      }
    };

    fetchAnimeList();
  }, []);

  return (
    <div className={styles.container}>
      <Link href="/pages/home" className={styles.icon__backButton}>        
        <div className={styles.icon__backButton}>
          <i className="bx bx-chevron-left-circle"></i>
        </div>
      </Link>

      <div className={styles.filterBar}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.listContainer}>
        {animeList.map((anime) => (
          <div key={anime.mal_id} className={styles.animeCard}>
            <div className={styles.animeImageBox}>
              <img src={anime.images.jpg.image_url} alt={anime.title} />
            </div>
            <div className={styles.animeInfo}>
              <h3>{anime.title}</h3>
              <p>{anime.studios[0]?.name || 'Unknown Studio'}</p>
              <p>{anime.aired.string}</p>
            </div>
            <button className={styles.editButton}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
