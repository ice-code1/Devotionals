import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Devotional, ModeratorCard } from '../../lib/supabase';
import { generateSlug, createUniqueSlug, getCanonicalUrl } from '../../utils/slug';
import { format } from 'date-fns';
import { 
  Plus, 
  LogOut, 
  Book, 
  Users, 
  Copy, 
  ExternalLink,
  Calendar,
  User,
  Save,
  Eye
} from 'lucide-react';
import ShareCard from '../../components/ShareCard';

type TabType = 'devotionals' | 'moderator-cards';

export default function AdminDashboard() {
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('devotionals');
  const [recentDevotionals, setRecentDevotionals] = useState<Devotional[]>([]);
  const [recentModeratorCards, setRecentModeratorCards] = useState<ModeratorCard[]>([]);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  
  // Devotional form state
  const [devotionalForm, setDevotionalForm] = useState({
    section: 'children' as 'children' | 'teenagers',
    title: '',
    body: '',
    scripture: '',
    authorName: '',
    authorImage: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });
  const [devotionalPreview, setDevotionalPreview] = useState<Devotional | null>(null);
  const [isSubmittingDevotional, setIsSubmittingDevotional] = useState(false);

  // Moderator card form state
  const [moderatorCardForm, setModeratorCardForm] = useState({
    section: 'children' as 'children' | 'teenagers',
    message: '',
    preview: '',
    moderatorImage: '',
  });
  const [isSubmittingModeratorCard, setIsSubmittingModeratorCard] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentData();
      fetchExistingSlugs();
    }
  }, [user]);

  const fetchRecentData = async () => {
    try {
      // Fetch recent devotionals
      const { data: devotionalData } = await supabase
        .from('devotionals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (devotionalData) {
        setRecentDevotionals(devotionalData);
      }

      // Fetch recent moderator cards
      const { data: moderatorData } = await supabase
        .from('moderator_cards')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (moderatorData) {
        setRecentModeratorCards(moderatorData);
      }
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  const fetchExistingSlugs = async () => {
    try {
      const { data, error } = await supabase
        .from('devotionals')
        .select('slug');

      if (error) throw error;
      setExistingSlugs(data?.map(d => d.slug) || []);
    } catch (error) {
      console.error('Error fetching slugs:', error);
    }
  };

  const handleDevotionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDevotional(true);

    try {
      const baseSlug = generateSlug(devotionalForm.title, devotionalForm.date);
      const uniqueSlug = createUniqueSlug(baseSlug, existingSlugs);

      const { data, error } = await supabase
        .from('devotionals')
        .insert([{
          ...devotionalForm,
          slug: uniqueSlug,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update state
      setRecentDevotionals(prev => [data, ...prev.slice(0, 9)]);
      setExistingSlugs(prev => [...prev, uniqueSlug]);
      setDevotionalPreview(data);
      
      // Reset form
      setDevotionalForm({
        section: 'children',
        title: '',
        body: '',
        scripture: '',
        authorName: '',
        authorImage: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });

      alert('Devotional created successfully!');
    } catch (error) {
      console.error('Error creating devotional:', error);
      alert('Error creating devotional. Please try again.');
    } finally {
      setIsSubmittingDevotional(false);
    }
  };

  const handleModeratorCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingModeratorCard(true);

    try {
      const { data, error } = await supabase
        .from('moderator_cards')
        .insert([moderatorCardForm])
        .select()
        .single();

      if (error) throw error;

      // Update state
      setRecentModeratorCards(prev => [data, ...prev.slice(0, 9)]);
      
      // Reset form
      setModeratorCardForm({
        section: 'children',
        message: '',
        preview: '',
        moderatorImage: '',
      });

      alert('Moderator card created successfully!');
    } catch (error) {
      console.error('Error creating moderator card:', error);
      alert('Error creating moderator card. Please try again.');
    } finally {
      setIsSubmittingModeratorCard(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Welcome, {user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('devotionals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'devotionals'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Book className="h-5 w-5" />
            <span>Devotionals</span>
          </button>
          <button
            onClick={() => setActiveTab('moderator-cards')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'moderator-cards'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Moderator Cards</span>
          </button>
        </div>

        {activeTab === 'devotionals' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Devotional Form */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Plus className="h-6 w-6 text-green-400" />
                <span>Add New Devotional</span>
              </h2>

              <form onSubmit={handleDevotionalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Section
                    </label>
                    <select
                      value={devotionalForm.section}
                      onChange={(e) => setDevotionalForm(prev => ({ 
                        ...prev, 
                        section: e.target.value as 'children' | 'teenagers'
                      }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="children">Children</option>
                      <option value="teenagers">Teenagers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={devotionalForm.date}
                      onChange={(e) => setDevotionalForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={devotionalForm.title}
                    onChange={(e) => setDevotionalForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter devotional title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Scripture
                  </label>
                  <input
                    type="text"
                    required
                    value={devotionalForm.scripture}
                    onChange={(e) => setDevotionalForm(prev => ({ ...prev, scripture: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Bible verse"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Body
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={devotionalForm.body}
                    onChange={(e) => setDevotionalForm(prev => ({ ...prev, body: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter devotional content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Name
                    </label>
                    <input
                      type="text"
                      required
                      value={devotionalForm.authorName}
                      onChange={(e) => setDevotionalForm(prev => ({ ...prev, authorName: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Author Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={devotionalForm.authorImage}
                      onChange={(e) => setDevotionalForm(prev => ({ ...prev, authorImage: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingDevotional}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmittingDevotional ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Create Devotional</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Preview and Recent Devotionals */}
            <div className="space-y-6">
              {/* Preview */}
              {devotionalPreview && (
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <span>Created Devotional</span>
                  </h3>
                  
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Canonical URL:</span>
                      <button
                        onClick={() => copyToClipboard(getCanonicalUrl(devotionalPreview.slug))}
                        className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex items-center space-x-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm text-blue-400 break-all">
                      {getCanonicalUrl(devotionalPreview.slug)}
                    </div>
                  </div>

                  <ShareCard
                    title={devotionalPreview.title}
                    scripture={devotionalPreview.scripture}
                    shortKeyPoint={devotionalPreview.body.split('.')[0] + '.'}
                    authorName={devotionalPreview.authorName}
                    authorImage={devotionalPreview.authorImage}
                    canonicalUrl={getCanonicalUrl(devotionalPreview.slug)}
                    section={devotionalPreview.section}
                    date={devotionalPreview.date}
                    slug={devotionalPreview.slug}
                  />
                </div>
              )}

              {/* Recent Devotionals */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Recent Devotionals</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentDevotionals.map((devotional) => (
                    <div key={devotional.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{devotional.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span className="capitalize">{devotional.section}</span>
                            <span>{format(new Date(devotional.date), 'MMM dd, yyyy')}</span>
                          </div>
                        </div>
                        <a
                          href={`/devotional/${devotional.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {devotional.body.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderator-cards' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Add Moderator Card Form */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Plus className="h-6 w-6 text-green-400" />
                <span>Add New Moderator Card</span>
              </h2>

              <form onSubmit={handleModeratorCardSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Section
                  </label>
                  <select
                    value={moderatorCardForm.section}
                    onChange={(e) => setModeratorCardForm(prev => ({ 
                      ...prev, 
                      section: e.target.value as 'children' | 'teenagers'
                    }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="children">Children</option>
                    <option value="teenagers">Teenagers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Welcome Message
                  </label>
                  <input
                    type="text"
                    required
                    value={moderatorCardForm.message}
                    onChange={(e) => setModeratorCardForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Welcome message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preview Text
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={moderatorCardForm.preview}
                    onChange={(e) => setModeratorCardForm(prev => ({ ...prev, preview: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Preview description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Moderator Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={moderatorCardForm.moderatorImage}
                    onChange={(e) => setModeratorCardForm(prev => ({ ...prev, moderatorImage: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingModeratorCard}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmittingModeratorCard ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Create Moderator Card</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent Moderator Cards */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Recent Moderator Cards</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentModeratorCards.map((card) => (
                  <div key={card.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={card.moderatorImage}
                        alt="Moderator"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{card.message}</h4>
                        <div className="text-sm text-gray-400 mt-1 capitalize">
                          {card.section} • {format(new Date(card.created_at), 'MMM dd, yyyy')}
                        </div>
                        <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                          {card.preview}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}