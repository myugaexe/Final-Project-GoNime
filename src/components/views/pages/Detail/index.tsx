'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import style from './Detail.module.scss';

type Anime = {
  trailer?: { embed_url?: string };
  images: { jpg: { image_url: string } };
  title: string;
  studios: { name: string }[];
  genres: { name: string }[];
  aired: { string: string };
  rank: number;
  popularity: number;
  score: number;
  scored_by: number;
  synopsis: string;
};

type DetailViewProps = {
  animeId: string;
};

const DetailView = ({ animeId }: DetailViewProps) => {
  const [anime, setAnime] = useState<Anime | null>(null);

  useEffect(() => {
    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
      .then(res => res.json())
      .then(data => setAnime(data.data))
      .catch(err => console.error(err));
  }, [animeId]);

  if (!anime) return <div>Loading...</div>;
  
  return (
    <div>
      <div className={style.topcontainer}>     
        <Link href="/pages/home" className={style.backButton}>
            < i className="bxr  bx-chevron-left-circle"  ></i> 
        </Link>   
        {anime.trailer?.embed_url ? (
          <iframe
            className={style.topcontainer__trailer}
            src={anime.trailer.embed_url}
            allowFullScreen
          />
        ) : (
          <div className={style.topcontainer__trailer}>
            <p style={{ textAlign: 'center', paddingTop: '120px', color: '#aaa' }}>
              No Trailer Available
            </p>
          </div>
        )}

        <div className={style.topcontainer__info}>
          <div className={style.topcontainer__poster}>
            <img
              src={anime.images.jpg.image_url}
              alt="Poster"
              width={150}
              height={170}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          </div>

          <div className={style.topcontainer__text}>
            <div className={style.topcontainer__title}>{anime.title}</div>
            <div className={style.topcontainer__subtittle}>
              {anime.studios[0]?.name || 'Unknown Studio'}
            </div>
            <div className={style.topcontainer__subtittle}>
              {anime.genres.map(g => g.name).join(', ')} • {anime.aired.string}
            </div>
          </div>
        </div>

        <div className={style.topcontainer__stats}>
          <div className={style.statBox}>
            <div className={style.statInner}>
              <div className={style.statItem}>
                <i className="bxr  bx-trophy-star"></i> 
                <div>
                  <div className={style.statNumber}>#{anime.rank}</div>
                  <div className={style.statLabel}>Ranked</div>
                </div>
              </div>
              <div className={style.statItem}>
                <i className="bx bx-fire"></i>
                <div>
                  <div className={style.statNumber}>#{anime.popularity}</div>
                  <div className={style.statLabel}>Popularity</div>
                </div>
              </div>
            </div>
          </div>

          <div className={style.statBox}>
            <div className={style.statInner}>
              <div className={style.statItem}>
                <i className="bx bx-star"></i>
                <div>
                  <div className={style.statNumber}>
                    {anime.score ?? 'N/A'}
                  </div>
                  <div className={style.statLabel}>
                    from {anime.scored_by?.toLocaleString() || '0'} users
                  </div>
                </div>
              </div>
              <div className={style.statItem}>
                <button className={style.rateNow}>Rate Now</button>
              </div>
            </div>
          </div>
        </div>

        <div className={style.topcontainer__description}>
          {anime.synopsis}
        </div>
      </div>
    </div>
  );
};

export default DetailView;
