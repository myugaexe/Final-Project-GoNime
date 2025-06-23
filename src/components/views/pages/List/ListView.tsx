'use client';

import { useEffect, useState } from 'react';
import styles from './List.module.scss';
import Link from 'next/link';
import RateForm from './RateFormList';

type Anime = {
  image_url: string | Blob | undefined;
  animeId: number;
  title: string;
  studios: { name: string }[];
  aired: { string: string };
  status: string;
  score: number; 
};

const ListView = () => {
  const [activeFilter, setActiveFilter] = useState('Currently Watching');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filters = [
    { value: 'Currently Watching', label: 'Currently Watching' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Dropped', label: 'Dropped' },
    { value: 'Plan to Watch', label: 'Plan to Watch' },
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
    (anime) => anime.status === activeFilter
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000); 
  };

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
            key={filter.value}
            className={`${styles.filterButton} ${activeFilter === filter.value ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.listContainer}>
        {filteredAnimeList.map((anime) => (
          <div key={anime.animeId} className={styles.animeCard}>
            <div className={styles.animeImageBox}>
              <img src={anime.image_url} alt={anime.title} />
            </div>
            <div className={styles.animeInfo}>
              <h3>{anime.title}</h3>
              <p>{anime.studios[0]?.name || 'Unknown Studio'}</p>
              <p>{anime.aired.string}</p>
              <p>My Rating: {anime.score}/10</p>
            </div>            
            <button
              className={styles.editButton}
              onClick={() => {
                setSelectedAnime(anime);
                setIsPopupOpen(true);
              }}
            >
              <i className="bx bx-pencil"></i>
            </button>
          </div>
        ))}
      </div>

      {selectedAnime && (
        <RateForm
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedAnime(null);
          }}
          isOpen={isPopupOpen}
          animeId={selectedAnime.animeId}
          title={selectedAnime.title}
          imageUrl={typeof selectedAnime.image_url === 'string' ? selectedAnime.image_url : ''}
          studio={selectedAnime.studios[0]?.name || 'Unknown Studio'}
          genres={'Unknown'} 
          aired={selectedAnime.aired.string}
          totalEpisodes={12} 
          showToast={showToast}
        />
      )}
      
      {toast && (
        <div className={styles.toast}>
          {toast}
        </div>
      )}
    </div>
  );
};

export default ListView;
