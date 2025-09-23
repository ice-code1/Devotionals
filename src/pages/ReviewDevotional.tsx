import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, DevotionalSubmission } from '../lib/supabase';
import { format } from 'date-fns';
import { Eye, Calendar, User, Book } from 'lucide-react';

export default function ReviewDevotional() {
  const { reviewLink } = useParams<{ reviewLink: string }>();
  const [submission, setSubmission] = useState<DevotionalSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reviewLink) {
      fetchSubmission();
    }
  }, [reviewLink]);

  const fetchSubmission = async () => {
    if (!reviewLink) return;

    try {
      const { data, error } = await supabase
        .from('devotional_submissions')
        .select(`
          *,
          writer:writers(name, profile_image, bio)
        `)
        .eq('review_link', reviewLink)
        .single();

      if (error) throw error;
      setSubmission(data);
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <Book className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <div className="text-2xl font-bold text-gray-800">Loading preview...</div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Preview Not Found</h1>
          <p className="text-gray-600">The devotional preview you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const section = submission.section;

  return (
    <div className={`min-h-screen py-8 px-4 ${
      section === 'children'
        ? 'bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50'
        : 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Preview Banner */}
        <div className={`rounded-2xl p-4 text-center ${
          section === 'children'
            ? 'bg-yellow-200 text-yellow-800'
            : 'bg-purple-800 text-purple-200'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <Eye className="h-5 w-5" />
            <span className="font-bold">PREVIEW MODE - This devotional is pending approval</span>
          </div>
        </div>

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
                <time>
                  Submitted on {format(new Date(submission.submitted_at), 'EEEE, MMMM dd, yyyy')}
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
              {submission.title}
            </h1>
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
              "{submission.scripture}"
            </p>
          </div>

          {/* Body */}
          <div className={`prose prose-lg max-w-none mb-8 ${
            section === 'children'
              ? 'text-gray-700'
              : 'text-gray-300 prose-invert'
          }`}>
            <div 
              dangerouslySetInnerHTML={{ __html: submission.body }}
              className="leading-relaxed"
            />
          </div>

          {/* Author */}
          <div className={`flex items-center space-x-4 pt-6 border-t ${
            section === 'children' ? 'border-gray-200' : 'border-gray-700'
          }`}>
            {submission.writer?.profile_image && (
              <img
                src={submission.writer.profile_image}
                alt={submission.writer?.name}
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
            )}
            <div>
              <div className={`flex items-center space-x-2 font-semibold ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}>
                <User className="h-4 w-4" />
                <span>{submission.writer?.name}</span>
              </div>
              <div className={`text-sm ${
                section === 'children' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                Author
              </div>
              {submission.writer?.bio && (
                <div className={`text-sm mt-2 ${
                  section === 'children' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {submission.writer.bio}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Status Information */}
        <div className={`rounded-2xl shadow-xl p-6 text-center ${
          section === 'children'
            ? 'bg-white'
            : 'bg-gray-900 border border-purple-500/20'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            Submission Status
          </h2>
          
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            submission.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : submission.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
          }`}>
            <span className="capitalize font-medium">{submission.status}</span>
          </div>

          {submission.admin_notes && (
            <div className={`mt-4 p-4 rounded-lg ${
              section === 'children'
                ? 'bg-gray-100'
                : 'bg-gray-800'
            }`}>
              <div className={`font-medium mb-2 ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}>
                Admin Notes:
              </div>
              <div className={`text-sm ${
                section === 'children' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {submission.admin_notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}