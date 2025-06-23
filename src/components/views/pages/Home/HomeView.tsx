"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./Home.module.scss";

type Anime = {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
};

const HomeView = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [genre, setGenre] = useState("");
  const [minScore, setMinScore] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const fetchAnimes = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/homepage?page=${pageNum}`);
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        if (data.data.length < 25) setHasMore(false);

        // Use Map to ensure uniqueness of anime entries
        const uniqueAnimeMap = new Map([
          ...animes.map(anime => [anime.mal_id, anime]),
          ...data.data.map((anime: Anime) => [anime.mal_id, anime])
        ]);

        setAnimes(Array.from(uniqueAnimeMap.values()) as Anime[]);
      }
    } catch (error) {
      console.error("Failed to fetch animes:", error);
      setHasMore(false);
    }
    setIsLoading(false);
  }, [animes]);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (genre) params.append("genre", genre);
      if (minScore) params.append("minScore", minScore);
      if (orderBy) params.append("orderBy", orderBy);

      const res = await fetch(`/api/searchanime?${params.toString()}`);
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        // Filter duplikat berdasarkan mal_id
        const uniqueMap = new Map<number, Anime>();
        data.data.forEach((anime: Anime) => {
          uniqueMap.set(anime.mal_id, anime);
        });

        setAnimes(Array.from(uniqueMap.values()));
        setHasMore(false);
        setIsSearchMode(true);
      } else {
        setAnimes([]);
        setIsSearchMode(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setAnimes([]);
    }
    setIsLoading(false);
  }, [searchQuery, genre, minScore, orderBy]);

  const handleReset = () => {
    setSearchQuery("");
    setPage(1);
    setAnimes([]);
    setHasMore(true);
    setIsSearchMode(false);
    setGenre("");
    setMinScore("");
    setOrderBy("");
  };
  useEffect(() => {
    if (!isSearchMode) {
      fetchAnimes(page);
    }
  }, [page, isSearchMode, fetchAnimes]);
  useEffect(() => {
    if (genre || minScore || orderBy || searchQuery.trim()) {
      handleSearch();
    }
  }, [genre, minScore, orderBy, handleSearch, searchQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <button className={styles.iconButton} onClick={handleReset}>
          <i className="bx bx-home"></i>
        </button>

        <div className={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search for an anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={handleSearch}>
            <i className="bx bx-search"></i>
          </button>
        </div>

        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="1">Action</option>
          <option value="2">Adventure</option>
          <option value="4">Comedy</option>
          <option value="8">Drama</option>
          <option value="10">Fantasy</option>
          <option value="14">Horror</option>
          <option value="22">Romance</option>
          <option value="24">Sci-Fi</option>
        </select>

        <select value={minScore} onChange={(e) => setMinScore(e.target.value)}>
          <option value="">Min Score</option>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={(i + 1).toString()}>
              {i + 1}
            </option>
          ))}
        </select>

        <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
          <option value="">Default</option>
          <option value="popularity">Popularity</option>
          <option value="score">Score</option>
        </select>

        <Link href="/pages/list">  
        <button className={styles.iconButton}>
          < i className="bxr  bx-bookmark"></i> 
        </button>
        </Link>
        <Link href="/pages/profile">
        <button className={styles.iconButton}>
          <i className="bx bx-user-circle"></i>          
        </button>
        </Link>
      </div>

      <div className={styles.section}>
        <h3>{isSearchMode ? "Search Result" : "Recommended For You"}</h3>

        {animes.length > 0 ? (
          <div className={styles.animeGrid}>
            {animes.map((anime: Anime) => (
              <Link href={`/pages/detail/${anime.mal_id}`} key={anime.mal_id} className={styles.animeCard}>
                <Image 
                  src={anime.images.jpg.image_url} 
                  alt={anime.title}
                  width={200}
                  height={300}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto'
                  }}
                />
                <p>{anime.title}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#888" }}>
            Anime not found.
          </p>
        )}

        {!isSearchMode && hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
