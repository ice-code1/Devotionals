import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Heart, Book } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <Heart className="h-12 w-12 text-purple-600" />
            <Book className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Daily Devotionals
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your day with God's word. Choose your devotional journey and grow in faith together.
          </p>
        </div>

        {/* Devotional Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Children's Card */}
          <Link to="/children" className="group">
            <div className="bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-yellow-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="absolute bottom-4 left-4 text-pink-400">
                <Star className="h-6 w-6" fill="currentColor" />
              </div>
              <div className="absolute top-1/2 left-0 w-16 h-16 bg-white/30 rounded-full -translate-x-8"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full translate-x-10 translate-y-10"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 text-center">🌟</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  Children's Devotional
                </h2>
                <p className="text-gray-700 text-lg text-center mb-8">
                  Fun, colorful, and age-appropriate devotionals that help kids discover God's love in simple, exciting ways!
                </p>
                <div className="bg-white/50 rounded-2xl p-4 text-center group-hover:bg-white/70 transition-colors">
                  <span className="text-gray-800 font-bold text-lg">
                    Start Your Adventure →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Teenagers' Card */}
          <Link to="/teenagers" className="group">
            <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-purple-400">
                <Star className="h-8 w-8" fill="currentColor" />
              </div>
              <div className="absolute bottom-4 left-4 text-blue-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-600/20 rounded-full -translate-y-16"></div>
              <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-blue-600/20 rounded-full translate-y-12"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 text-center">⚡</div>
                <h2 className="text-3xl font-bold text-white mb-4 text-center">
                  Teenagers' Devotional
                </h2>
                <p className="text-gray-300 text-lg text-center mb-8">
                  Deep, relevant devotionals that speak to the real challenges and questions teens face in today's world.
                </p>
                <div className="bg-white/10 rounded-2xl p-4 text-center group-hover:bg-white/20 transition-colors border border-white/20">
                  <span className="text-white font-bold text-lg">
                    Dive Deeper →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">
            What Makes Our Devotionals Special
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Shareable Content</h4>
              <p className="text-gray-600">
                Create beautiful share cards with QR codes that link directly to each devotional
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Complete Archive</h4>
              <p className="text-gray-600">
                Access all past devotionals anytime to revisit favorite messages and lessons
              </p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Age-Appropriate Design</h4>
              <p className="text-gray-600">
                Thoughtfully designed interfaces that resonate with each age group
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}