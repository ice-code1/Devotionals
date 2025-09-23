import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase, Devotional } from '../lib/supabase';
import { getCanonicalUrl } from '../utils/slug';
import ShareCard from '../components/ShareCard';
import InteractiveElements from '../components/InteractiveElements';
import PrayerRequestForm from '../components/PrayerRequestForm';
import CounselRequestForm from '../components/CounselRequestForm';
import QuestionForm from '../components/QuestionForm';
import FavoriteButton from '../components/FavoriteButton';
import ReadAloudButton from '../components/ReadAloudButton';
import { format } from 'date-fns';
import { Calendar, User, Book } from 'lucide-react';
import DOMPurify from 'dompurify';


export default function DevotionalDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchDevotional();
    }
  }, [slug]);

  const fetchDevotional = async () => {
    if (!slug) return;

    try {
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setDevotional(data);
    } catch (error) {
      console.error('Error fetching devotional:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Book className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <div className="text-2xl font-bold text-gray-800">Loading devotional...</div>
        </div>
      </div>
    );
  }

  if (!devotional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Devotional Not Found</h1>
          <p className="text-gray-600">The devotional you're looking for doesn't exist.</p>
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
  const section = devotional.section;
  const fullText = `${devotional.title}. ${devotional.scripture}. ${plainTextBody}`;


  return (
    <>
      <Helmet>
        <title>{devotional.title} - Young Champions</title>
        <meta name="description" content={shortKeyPoint} />
        <meta property="og:title" content={devotional.title} />
        <meta property="og:description" content={shortKeyPoint} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={devotional.title} />
        <meta name="twitter:description" content={shortKeyPoint} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": devotional.title,
            "description": shortKeyPoint,
            "author": {
              "@type": "Person",
              "name": devotional.authorName,
              "image": devotional.authorImage
            },
            "datePublished": devotional.date,
            "url": canonicalUrl
          })}
        </script>
      </Helmet>

      <div className={`min-h-screen py-8 px-4 ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
          : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
      }`}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Devotional Content */}
          <article className={`rounded-2xl shadow-xl p-8 ${
            section === 'children'
              ? 'bg-white'
              : 'bg-gray-900 border border-purple-500/20'
          }`}>
            <header className="text-center mb-8">
              <div className="flex justify-center items-center space-x-4 mb-4">
                <div className={`flex items-center space-x-2 text-sm ${
                  section === 'children' ? 'text-blue-600' : 'text-purple-400'
                }`}>
                  <Calendar className="h-4 w-4" />
                  <time dateTime={devotional.date}>
                    {format(new Date(devotional.date), 'EEEE, MMMM dd, yyyy')}
                  </time>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                  section === 'children'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-900/50 text-purple-300 border border-purple-500/30'
                }`}>
                  {section}
                </div>
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
              className={`prose prose-lg max-w-none mb-8
                ${section === 'children'
                  ? `
                    prose-blue 
                    prose-headings:text-gray-800 
                    prose-p:text-gray-700 
                    prose-strong:text-blue-700 
                    prose-blockquote:border-l-4 
                    prose-blockquote:border-yellow-400 
                    prose-blockquote:bg-yellow-50 
                    prose-blockquote:text-gray-800 
                    prose-blockquote:italic 
                    prose-blockquote:px-4 
                    prose-blockquote:py-2 
                    prose-blockquote:rounded-r-lg
                  `
                  : `
                    prose-invert prose-purple 
                    prose-headings:text-purple-200 
                    prose-p:text-gray-300 
                    prose-strong:text-purple-400 
                    prose-blockquote:border-l-4 
                    prose-blockquote:border-purple-500 
                    prose-blockquote:bg-purple-900/40 
                    prose-blockquote:text-purple-200 
                    prose-blockquote:italic 
                    prose-blockquote:px-4 
                    prose-blockquote:py-2 
                    prose-blockquote:rounded-r-lg
                  `}
              `}
              dangerouslySetInnerHTML={{ __html: cleanBody }}
            />




            {/* Author */}
            <div className={`flex items-center space-x-4 pt-6 border-t ${
              section === 'children' ? 'border-gray-200' : 'border-gray-700'
            }`}>
              <img
                src={devotional.authorImage}
                alt={devotional.authorName}
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
              <div>
                <div className={`flex items-center space-x-2 font-semibold ${
                  section === 'children' ? 'text-gray-800' : 'text-white'
                }`}>
                  <User className="h-4 w-4" />
                  <span>{devotional.authorName}</span>
                </div>
                <div className={`text-sm ${
                  section === 'children' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Author
                </div>
              </div>
            </div>
          </article>

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
    </>
  );
}