import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Devotional } from '../lib/supabase';
import { format } from 'date-fns';
import { Calendar, Book, ArrowRight } from 'lucide-react';

export default function Archive() {
  const { section } = useParams<{ section: 'children' | 'teenagers' }>();
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (section) {
      fetchDevotionals();
    }
  }, [section]);

  const fetchDevotionals = async () => {
    if (!section) return;

    try {
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .eq('section', section)
        .order('date', { ascending: false });

      if (error) throw error;
      setDevotionals(data || []);
    } catch (error) {
      console.error('Error fetching devotionals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
          : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      }`}>
        <div className="text-center">
          <Book className={`h-12 w-12 mx-auto mb-4 ${
            section === 'children' ? 'text-blue-600' : 'text-purple-400'
          }`} />
          <div className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            Loading archive...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 ${
      section === 'children'
        ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
        : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 capitalize ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            {section}'s Devotional Archive
          </h1>
          <p className={`text-lg ${
            section === 'children' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Browse through all past devotionals and revisit your favorite messages
          </p>
        </div>

        {/* Devotionals Grid */}
        {devotionals.length === 0 ? (
          <div className={`text-center p-12 rounded-2xl ${
            section === 'children'
              ? 'bg-white text-gray-800'
              : 'bg-gray-900 text-white border border-purple-500/20'
          }`}>
            <Book className={`h-16 w-16 mx-auto mb-4 ${
              section === 'children' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <h2 className="text-2xl font-bold mb-2">No devotionals yet</h2>
            <p className={`${
              section === 'children' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              Check back soon for inspiring devotionals!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {devotionals.map((devotional) => (
              <Link
                key={devotional.id}
                to={`/devotional/${devotional.slug}`}
                className="group"
              >
                <div className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  section === 'children'
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-gray-900 hover:bg-gray-800 border border-purple-500/20'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex items-center space-x-2 text-sm ${
                      section === 'children' ? 'text-blue-600' : 'text-purple-400'
                    }`}>
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(devotional.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <ArrowRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      section === 'children' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>

                  <h3 className={`text-xl font-bold mb-3 group-hover:${
                    section === 'children' ? 'text-blue-600' : 'text-purple-400'
                  } transition-colors ${
                    section === 'children' ? 'text-gray-800' : 'text-white'
                  }`}>
                    {devotional.title}
                  </h3>

                  <div className={`p-3 rounded-lg mb-4 ${
                    section === 'children'
                      ? 'bg-yellow-50 border-l-4 border-yellow-400'
                      : 'bg-purple-900/30 border-l-4 border-purple-400'
                  }`}>
                    <p className={`text-sm font-medium ${
                      section === 'children' ? 'text-gray-700' : 'text-gray-300'
                    }`}>
                      "{devotional.scripture}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img
                      src={devotional.authorImage}
                      alt={devotional.authorName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className={`text-sm font-medium ${
                      section === 'children' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {devotional.authorName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}