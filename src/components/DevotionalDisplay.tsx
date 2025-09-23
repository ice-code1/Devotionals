import React from 'react';
import { format } from 'date-fns';
import { Devotional } from '../lib/supabase';
import { getCanonicalUrl } from '../utils/slug';
import ShareCard from './ShareCard';
import InteractiveElements from './InteractiveElements';
import PrayerRequestForm from './PrayerRequestForm';
import CounselRequestForm from './CounselRequestForm';
import QuestionForm from './QuestionForm';
import FavoriteButton from './FavoriteButton';
import ReadAloudButton from './ReadAloudButton';
import DOMPurify from 'dompurify';


interface DevotionalDisplayProps {
  devotional: Devotional | null;
  section: 'children' | 'teenagers';
}

export default function DevotionalDisplay({ devotional, section }: DevotionalDisplayProps) {
  if (!devotional) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
          : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      }`}>
        <div className={`text-center p-8 rounded-2xl ${
          section === 'children'
            ? 'bg-white text-gray-800'
            : 'bg-gray-900 text-white'
        }`}>
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold mb-4">No devotional found</h2>
          <p className="text-gray-500">Check back later for today's message!</p>
        </div>
      </div>
    );
  }

  const canonicalUrl = getCanonicalUrl(devotional.slug);
  const plainTextBody = DOMPurify.sanitize(devotional.body, { ALLOWED_TAGS: [] });
  const cleanBody = DOMPurify.sanitize(devotional.body, {
                      ALLOWED_TAGS: [
                        'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'blockquote', 'strong', 'em', 'u', 'ol', 'ul', 'li',
                        'span', 'div', 'img', 'a'
                      ],
                      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'style']
                    });
  const shortKeyPoint = plainTextBody.split('.')[0] + '.';
  const fullText = `${devotional.title}. ${devotional.scripture}. ${plainTextBody}`;


  return (
    <div className={`min-h-screen py-8 px-4 ${
      section === 'children'
        ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
        : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Devotional Content */}
        <div className={`rounded-2xl shadow-xl p-8 ${
          section === 'children'
            ? 'bg-white'
            : 'bg-gray-900 border border-purple-500/20'
        }`}>
          <header className="text-center mb-8">
            <div className={`text-sm font-medium mb-2 ${
              section === 'children' ? 'text-blue-600' : 'text-purple-400'
            }`}>
              {format(new Date(devotional.date), 'EEEE, MMMM dd, yyyy')}
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              {devotional.title}
            </h1>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <FavoriteButton devotional={devotional} section={section} />
              <ReadAloudButton text={fullText} section={section} />
            </div>
          </header>

          {/* Scripture */}
          <div className={`p-6 rounded-xl mb-8 ${
            section === 'children'
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-yellow-500'
              : 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-l-4 border-purple-500'
          }`}>
            <p className={`text-xl font-semibold leading-relaxed text-center ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              "{devotional.scripture}"
            </p>
          </div>

          {/* Body */}
          <div
            className={`prose prose-lg max-w-none mb-8 ${
              section === 'children'
                ? 'prose-blue prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-blue-700'
                : 'prose-invert prose-purple prose-headings:text-purple-200 prose-p:text-gray-300 prose-strong:text-purple-400'
            }`}
            dangerouslySetInnerHTML={{ __html: cleanBody }}
          />



          {/* Author */}
          <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
            <img
              src={devotional.authorImage}
              alt={devotional.authorName}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
            <div>
              <div className={`font-semibold ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}>
                {devotional.authorName}
              </div>
              <div className={`text-sm ${
                section === 'children' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Author
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Games */}
        <InteractiveElements
          devotional={{
            title: devotional.title,
            scripture: devotional.scripture,
            content: devotional.body
          }}
          section={section}
        />

        {/* Interactive Forms */}
        <div className="grid md:grid-cols-3 gap-6">
          <PrayerRequestForm section={section} />
          <CounselRequestForm section={section} />
          <QuestionForm
            devotionalId={devotional.id}
            devotionalTitle={devotional.title}
            section={section}
          />
        </div>

        {/* Share Section */}
        <div className={`rounded-2xl shadow-xl p-8 ${
          section === 'children'
            ? 'bg-white'
            : 'bg-gray-900 border border-purple-500/20'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            Share This Devotional
          </h2>
          
          <ShareCard
            title={devotional.title}
            scripture={devotional.scripture}
            shortKeyPoint={shortKeyPoint}
            authorName={devotional.authorName}
            authorImage={devotional.authorImage}
            canonicalUrl={canonicalUrl}
            section={section}
            date={devotional.date}
            slug={devotional.slug}
          />
        </div>
      </div>
    </div>
  );
}