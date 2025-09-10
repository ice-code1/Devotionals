import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, Send, CheckCircle } from 'lucide-react';

interface PrayerRequestFormProps {
  section: 'children' | 'teenagers';
}

export default function PrayerRequestForm({ section }: PrayerRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    prayer_request: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert([formData]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', location: '', phone: '', prayer_request: '' });
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      alert('Error submitting prayer request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`rounded-2xl p-8 text-center ${
        section === 'children'
          ? 'bg-gradient-to-r from-pink-100 to-purple-100'
          : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50'
      }`}>
        <CheckCircle className={`h-16 w-16 mx-auto mb-4 ${
          section === 'children' ? 'text-green-500' : 'text-green-400'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Prayer Request Submitted! 🙏
        </h3>
        <p className={`text-lg mb-6 ${
          section === 'children' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          Thank you for sharing your prayer request. Our prayer team will be praying for you!
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className={`px-6 py-3 rounded-lg font-bold ${
            section === 'children'
              ? 'bg-pink-500 hover:bg-pink-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-6 ${
      section === 'children'
        ? 'bg-gradient-to-r from-pink-100 to-purple-100'
        : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <Heart className={`h-8 w-8 ${
          section === 'children' ? 'text-pink-500' : 'text-pink-400'
        }`} />
        <h3 className={`text-2xl font-bold ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Prayer Request Box 🙏
        </h3>
      </div>

      <p className={`mb-6 ${
        section === 'children' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        Share your prayer request with us. We believe in the power of prayer and would love to pray for you!
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
                ? 'bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-purple-500 focus:ring-purple-200 text-white'
            }`}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Location *
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-purple-500 focus:ring-purple-200 text-white'
            }`}
            placeholder="Your city or country"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-purple-500 focus:ring-purple-200 text-white'
            }`}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            Prayer Request *
          </label>
          <textarea
            required
            rows={4}
            value={formData.prayer_request}
            onChange={(e) => setFormData(prev => ({ ...prev, prayer_request: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-purple-500 focus:ring-purple-200 text-white'
            }`}
            placeholder="Share what you'd like us to pray for..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-200 ${
            section === 'children'
              ? 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white'
              : 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Prayer Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}