'use client';

import { useEffect, useState } from 'react';
import styles from './List.module.scss';
import Link from 'next/link';
import RateForm from './rateform';

type Anime = {
  image_url: string | Blob | undefined;
  mal_id: number;
  title: string;
  studios: { name: string }[];
  aired: { string: string };
  status: string;
};

const ListView = () => {
  const [activeFilter, setActiveFilter] = useState('currently watching');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const filters = [
    'watching',
    'completed',
    'on hold',
    'dropped',
    'plan to watch',
  ];

  useEffect(() => {
    const fetchAnimeList = async () => {
      try {
        const res = await fetch(`/api/animelist`);
        const data = await res.json();
        setAnimeList(data);
      } catch (err) {
        console.error('Failed to fetch anime list:', err);
      }
    };

    fetchAnimeList();
  }, []);

  const filteredAnimeList = animeList.filter(
  (anime) => anime.status.toLowerCase() === activeFilter.toLowerCase()
);


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
        {filteredAnimeList.map((anime) => (
          <div key={anime.mal_id} className={styles.animeCard}>
            <div className={styles.animeImageBox}>
              <img src={anime.image_url} alt={anime.title} />
            </div>
            <div className={styles.animeInfo}>
              <h3>{anime.title}</h3>
              <p>{anime.studios[0]?.name || 'Unknown Studio'}</p>
              <p>{anime.aired.string}</p>
            </div>
            <button className={styles.editButton} onClick={() => setIsPopupOpen(true)}>Edit</button>
          </div>
        ))}
      </div>

      <RateForm
        onClose={() => setIsPopupOpen(false)}
        isOpen={isPopupOpen}
        animeId={animeId}
        title={anime.title}
        imageUrl={anime.images.jpg.image_url}
        studio={anime.studios[0]?.name || 'Unknown Studio'}
        genres={anime.genres.map(g => g.name).join(', ')}
        aired={anime.aired.string}
        totalEpisodes={anime.episodes}
      />
      
    </div>
  );
};

export default ListView;
