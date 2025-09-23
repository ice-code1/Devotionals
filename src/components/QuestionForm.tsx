import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';

interface QuestionFormProps {
  section: 'children' | 'teenagers';
  devotionalId: string;
  devotionalTitle: string;
}

export default function QuestionForm({ section, devotionalId, devotionalTitle }: QuestionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    question: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('devotional_questions')
        .insert([{
          ...formData,
          devotional_id: devotionalId
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', contact: '', question: '' });
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Error submitting question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`rounded-2xl p-8 text-center ${
        section === 'children'
          ? 'bg-gradient-to-r from-orange-100 to-yellow-100'
          : 'bg-gradient-to-r from-orange-900/50 to-yellow-900/50'
      }`}>
        <CheckCircle className={`h-16 w-16 mx-auto mb-4 ${
          section === 'children' ? 'text-green-500' : 'text-green-400'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Question Submitted! ❓
        </h3>
        <p className={`text-lg mb-6 ${
          section === 'children' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          Thank you for your question about "{devotionalTitle}". We'll get back to you with an answer soon!
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className={`px-6 py-3 rounded-lg font-bold ${
            section === 'children'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-orange-600 hover:bg-orange-700 text-white'
          }`}
        >
          Ask Another Question
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 ${
      section === 'children'
        ? 'bg-gradient-to-r from-orange-100 to-yellow-100'
        : 'bg-gradient-to-r from-orange-900/50 to-yellow-900/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <HelpCircle className={`h-8 w-8 ${
          section === 'children' ? 'text-orange-500' : 'text-orange-400'
        }`} />
        <h3 className={`text-2xl font-bold ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Ask a Question ❓
        </h3>
      </div>

      <p className={`mb-6 ${
        section === 'children' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        Have a question about "{devotionalTitle}"? We'd love to help you understand more!
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Your Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-orange-500 focus:ring-orange-200 text-white'
            }`}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Email or Phone *
          </label>
          <input
            type="text"
            required
            value={formData.contact}
            onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-orange-500 focus:ring-orange-200 text-white'
            }`}
            placeholder="Your email or phone number"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Your Question *
          </label>
          <textarea
            required
            rows={4}
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-orange-500 focus:ring-orange-200 text-white'
            }`}
            placeholder="What would you like to know about this devotional?"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-200 ${
            section === 'children'
              ? 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white'
              : 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Ask Question</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}