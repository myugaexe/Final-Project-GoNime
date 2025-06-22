'use client';

import React, { useState } from 'react';
import styles from './RateForm.module.scss';

type RatePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  animeId: number;
  title: string;
  imageUrl: string;
  studio: string;
  genres: string;
  aired: string;
  totalEpisodes: number;
  showToast: (message: string) => void;
};


const RateForm = ({ isOpen, onClose, animeId, title, imageUrl, studio, genres, aired, totalEpisodes, showToast }: RatePopupProps) => {
  const [status, setStatus] = useState("watching");
  const [episode, setEpisode] = useState(0);
  const [rating, setRating] = useState(8.5);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/editanimelist', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      animeId,
      status,
      progress: episode,
      score: rating
    })
  });


      if (res.ok) {
      console.log('Anime saved successfully!');
      showToast('Anime updated!');
      onClose();
    } else {
        const err = await res.json();
        console.error('Failed to save anime:', err?.error);
        showToast('Anime failed updated!');
      }
    } catch (err) {
      console.error('Error submitting anime:', err);
    }
  };

  const handleDelete = async () => {
  if (!confirm(`Are you sure you want to delete "${title}" from your list?`)) {
    return;
  }

  try {
    const res = await fetch('/api/deleteanimelist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        animeId
      })
    });

    if (res.ok) {
      console.log('Anime deleted successfully!');
      showToast('Anime deleted!');
      onClose();
    } else {
      const err = await res.json();
      console.error('Failed to delete anime:', err?.error);
      showToast('Anime failed deleted!');
    }
  } catch (err) {
    console.error('Error deleting anime:', err);
  }
};

  return (
    <div className={styles.popup__overlay}>
      <div className={styles.popup__content}>
        <div className={styles.popup__header}>
          <div className={styles.popup__imageBox}>
            <img src={imageUrl} alt="Poster" />
          </div>
          <div>
            <h2>{title}</h2>
            <p>{studio}</p>
            <p>{genres} • {aired}</p>
          </div>
        </div>

        <hr />

        <form onSubmit={handleSubmit}>
          <label className={styles.popup__label}>Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={styles.popup__select}
          >
            <option value="Currently Watching">Currently Watching</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Dropped">Dropped</option>
            <option value="Plan to Watch">Plan to Watch</option>
          </select>

          <label className={styles.popup__label}>Episode</label>
          <div className={styles.popup__sliderRow}>
            <input
              type="range"
              min="0"
              max={totalEpisodes}
              value={episode}
              onChange={e => setEpisode(Number(e.target.value))}
            />
            <span>{episode}/{totalEpisodes}</span>
          </div>

          <label className={styles.popup__label}>Rating</label>
          <div className={styles.popup__sliderRow}>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
            />
            <span>{rating.toFixed(1)}/10</span>
          </div>
  
          <div className={styles.popup__buttonRow}>
            <button type="button" onClick={handleDelete} className={styles.popup__deleteButton}>
              Delete
            </button>
            <button type="button" onClick={onClose} className={styles.popup__cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.popup__submitButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateForm;
