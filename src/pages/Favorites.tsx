import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, ArrowRight, Book } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { format } from 'date-fns';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useFavorites();

  const childrenFavorites = favorites.filter(f => f.section === 'children');
  const teenagersFavorites = favorites.filter(f => f.section === 'teenagers');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Heart className="h-12 w-12 text-pink-600 fill-current" />
            <Book className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Favorite Devotionals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your saved devotionals are here whenever you need inspiration and encouragement.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-xl">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start adding devotionals to your favorites to see them here!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/children"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition-colors"
              >
                Children's Devotionals
              </Link>
              <Link
                to="/teenagers"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-colors"
              >
                Teenagers' Devotionals
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Children's Favorites */}
            {childrenFavorites.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <span className="text-3xl">🌟</span>
                  <span>Children's Favorites ({childrenFavorites.length})</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {childrenFavorites.map((favorite) => (
                    <FavoriteCard
                      key={favorite.id}
                      favorite={favorite}
                      onRemove={removeFromFavorites}
                      section="children"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Teenagers' Favorites */}
            {teenagersFavorites.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                  <span className="text-3xl">⚡</span>
                  <span>Teenagers' Favorites ({teenagersFavorites.length})</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {teenagersFavorites.map((favorite) => (
                    <FavoriteCard
                      key={favorite.id}
                      favorite={favorite}
                      onRemove={removeFromFavorites}
                      section="teenagers"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface FavoriteCardProps {
  favorite: {
    id: string;
    slug: string;
    title: string;
    date: string;
    section: 'children' | 'teenagers';
    addedAt: string;
  };
  onRemove: (id: string) => void;
  section: 'children' | 'teenagers';
}

function FavoriteCard({ favorite, onRemove, section }: FavoriteCardProps) {
  return (
    <div className={`group relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      section === 'children'
        ? 'bg-gradient-to-br from-yellow-100 to-green-100'
        : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center space-x-2 text-sm ${
            section === 'children' ? 'text-blue-600' : 'text-purple-400'
          }`}>
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(favorite.date), 'MMM dd, yyyy')}</span>
          </div>
          <button
            onClick={() => onRemove(favorite.id)}
            className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
              section === 'children'
                ? 'bg-red-200 hover:bg-red-300 text-red-800'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            title="Remove from favorites"
          >
            <Heart className="h-4 w-4 fill-current" />
          </button>
        </div>

        <h3 className={`text-xl font-bold mb-4 group-hover:${
          section === 'children' ? 'text-blue-600' : 'text-purple-400'
        } transition-colors ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          {favorite.title}
        </h3>

        <div className={`text-xs mb-4 ${
          section === 'children' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Added {format(new Date(favorite.addedAt), 'MMM dd, yyyy')}
        </div>

        <Link
          to={`/devotional/${favorite.slug}`}
          className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
            section === 'children'
              ? 'bg-white hover:bg-blue-50 text-gray-800'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          <span className="font-medium">Read Devotional</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}