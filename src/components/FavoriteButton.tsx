import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useAnalyticsContext } from './AnalyticsProvider';

interface FavoriteButtonProps {
  devotional: {
    id: string;
    slug: string;
    title: string;
    date: string;
    section: 'children' | 'teenagers';
  };
  section: 'children' | 'teenagers';
}

export default function FavoriteButton({ devotional, section }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { trackFavorite } = useAnalyticsContext();
  const isLiked = isFavorite(devotional.id);

  const handleToggle = () => {
    const action = isLiked ? 'remove' : 'add';
    trackFavorite(action, devotional.id);
    toggleFavorite(devotional);
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
        isLiked
          ? section === 'children'
            ? 'bg-pink-200 text-pink-800 hover:bg-pink-300'
            : 'bg-pink-600 text-white hover:bg-pink-700'
          : section === 'children'
          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
      title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`h-5 w-5 transition-all ${
          isLiked ? 'fill-current' : ''
        }`} 
      />
      <span>{isLiked ? 'Favorited' : 'Add to Favorites'}</span>
    </button>
  );
}