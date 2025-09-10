import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Send, CheckCircle } from 'lucide-react';

interface CounselRequestFormProps {
  section: 'children' | 'teenagers';
}

export default function CounselRequestForm({ section }: CounselRequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    problem_statement: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('counsel_requests')
        .insert([formData]);

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: '', phone: '', problem_statement: '' });
    } catch (error) {
      console.error('Error submitting counsel request:', error);
      alert('Error submitting counsel request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`rounded-2xl p-8 text-center ${
        section === 'children'
          ? 'bg-gradient-to-r from-blue-100 to-green-100'
          : 'bg-gradient-to-r from-blue-900/50 to-green-900/50'
      }`}>
        <CheckCircle className={`h-16 w-16 mx-auto mb-4 ${
          section === 'children' ? 'text-green-500' : 'text-green-400'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Counsel Request Submitted! 💬
        </h3>
        <p className={`text-lg mb-6 ${
          section === 'children' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          Thank you for reaching out. Our counseling team will contact you soon to provide support and guidance.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className={`px-6 py-3 rounded-lg font-bold ${
            section === 'children'
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
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
        ? 'bg-gradient-to-r from-blue-100 to-green-100'
        : 'bg-gradient-to-r from-blue-900/50 to-green-900/50'
    }`}>
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className={`h-8 w-8 ${
          section === 'children' ? 'text-blue-500' : 'text-blue-400'
        }`} />
        <h3 className={`text-2xl font-bold ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          Need Counsel? 💬
        </h3>
      </div>

      <p className={`mb-6 ${
        section === 'children' ? 'text-gray-600' : 'text-gray-300'
      }`}>
        {section === 'children' 
          ? "Having a tough time? Our caring counselors are here to help you work through any problems or challenges you're facing."
          : "Going through something difficult? Our experienced counselors provide confidential support and biblical guidance for life's challenges."
        }
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
                ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-200 text-white'
            }`}
            placeholder="Enter your name"
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
                ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-200 text-white'
            }`}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            What's troubling you? *
          </label>
          <textarea
            required
            rows={5}
            value={formData.problem_statement}
            onChange={(e) => setFormData(prev => ({ ...prev, problem_statement: e.target.value }))}
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none ${
              section === 'children'
                ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-200 text-gray-800'
                : 'bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-200 text-white'
            }`}
            placeholder={section === 'children' 
              ? "Tell us what's bothering you or what problem you need help with..."
              : "Describe the situation or challenge you're facing. We're here to listen and help..."
            }
          />
        </div>

        <div className={`text-xs ${
          section === 'children' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          * All information is kept confidential and will only be shared with our trained counselors.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-200 ${
            section === 'children'
              ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white'
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Request Counseling</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}