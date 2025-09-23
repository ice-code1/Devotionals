import { useState, useEffect } from 'react';

export interface FavoriteDevotional {
  id: string;
  slug: string;
  title: string;
  date: string;
  section: 'children' | 'teenagers';
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteDevotional[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on mount
    const savedFavorites = localStorage.getItem('devotional-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteDevotional[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('devotional-favorites', JSON.stringify(newFavorites));
  };

  const addToFavorites = (devotional: {
    id: string;
    slug: string;
    title: string;
    date: string;
    section: 'children' | 'teenagers';
  }) => {
    const favorite: FavoriteDevotional = {
      ...devotional,
      addedAt: new Date().toISOString(),
    };

    const newFavorites = [favorite, ...favorites.filter(f => f.id !== devotional.id)];
    saveFavorites(newFavorites);
  };

  const removeFromFavorites = (devotionalId: string) => {
    const newFavorites = favorites.filter(f => f.id !== devotionalId);
    saveFavorites(newFavorites);
  };

  const isFavorite = (devotionalId: string) => {
    return favorites.some(f => f.id === devotionalId);
  };

  const toggleFavorite = (devotional: {
    id: string;
    slug: string;
    title: string;
    date: string;
    section: 'children' | 'teenagers';
  }) => {
    if (isFavorite(devotional.id)) {
      removeFromFavorites(devotional.id);
    } else {
      addToFavorites(devotional);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}