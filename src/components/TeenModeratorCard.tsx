import React from 'react';
import { ArrowRight, Zap, Star } from 'lucide-react';
import { ModeratorCard } from '../lib/supabase';

interface TeenModeratorCardProps {
  moderatorCard: ModeratorCard | null;
  onContinue: () => void;
}

export default function TeenModeratorCard({ moderatorCard, onContinue }: TeenModeratorCardProps) {
  if (!moderatorCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-purple-500/20">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-4">Welcome!</h2>
          <p className="text-gray-300 mb-6">Ready to dive deep into God's truth?</p>
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center space-x-2 w-full transition-all duration-200 transform hover:scale-105"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden border border-purple-500/20">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-purple-400">
          <Zap className="h-8 w-8" />
        </div>
        <div className="absolute bottom-4 left-4 text-blue-400">
          <Star className="h-6 w-6" fill="currentColor" />
        </div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full -translate-y-16"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-600/20 rounded-full translate-y-12"></div>
        
        <div className="relative z-10 text-center">
          <img
            src={moderatorCard.moderatorImage}
            alt="Moderator"
            className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-lg"
          />
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {moderatorCard.message}
          </h2>
          
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            {moderatorCard.preview}
          </p>
          
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-2 w-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span>Continue →</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}