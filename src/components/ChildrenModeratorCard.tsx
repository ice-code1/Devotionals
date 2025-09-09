import React from 'react';
import { ArrowRight, Star, Heart } from 'lucide-react';
import { ModeratorCard } from '../lib/supabase';

interface ChildrenModeratorCardProps {
  moderatorCard: ModeratorCard | null;
  onContinue: () => void;
}

export default function ChildrenModeratorCard({ moderatorCard, onContinue }: ChildrenModeratorCardProps) {
  if (!moderatorCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">Get ready for today's adventure with God!</p>
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center space-x-2 w-full transition-all duration-200 transform hover:scale-105"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-yellow-400">
          <Star className="h-8 w-8" fill="currentColor" />
        </div>
        <div className="absolute bottom-4 left-4 text-pink-400">
          <Heart className="h-6 w-6" fill="currentColor" />
        </div>
        <div className="absolute top-1/2 left-0 w-16 h-16 bg-blue-200 rounded-full -translate-x-8 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-green-200 rounded-full translate-x-10 translate-y-10 opacity-50"></div>
        
        <div className="relative z-10 text-center">
          <img
            src={moderatorCard.moderatorImage}
            alt="Moderator"
            className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-yellow-300 shadow-lg"
          />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {moderatorCard.message}
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {moderatorCard.preview}
          </p>
          
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center space-x-2 w-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span>Continue →</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}