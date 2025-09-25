import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Devotional, ModeratorCard } from '../../lib/supabase';
import { generateSlug, createUniqueSlug, getCanonicalUrl } from '../../utils/slug';
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import PreviewModal from "./PreviewModal";
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
  BarChart3,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import ShareCard from '../../components/ShareCard';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

type TabType = 'devotionals' | 'moderator-cards' | 'submissions' | 'data';

export default function AdminDashboard() {
  const { user, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('devotionals');
  const [recentDevotionals, setRecentDevotionals] = useState<Devotional[]>([]);
  const [recentModeratorCards, setRecentModeratorCards] = useState<ModeratorCard[]>([]);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<any[]>([]);
  const [counselRequests, setCounselRequests] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  
  //Preview modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
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
      fetchSubmissions();
      fetchUserData();
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

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('devotional_submissions')
        .select(`
          *,
          writer:writers(name, profile_image)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch prayer requests
      const { data: prayerData } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch counsel requests
      const { data: counselData } = await supabase
        .from('counsel_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch questions
      const { data: questionData } = await supabase
        .from('devotional_questions')
        .select(`
          *,
          devotional:devotionals(title)
        `)
        .order('created_at', { ascending: false });

      setPrayerRequests(prayerData || []);
      setCounselRequests(counselData || []);
      setQuestions(questionData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const handleSubmissionAction = async (submissionId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      if (action === 'approve') {
        // Get submission details
        const submission = submissions.find(s => s.id === submissionId);
        if (!submission) return;

        // Create devotional from submission
        const baseSlug = generateSlug(submission.title, format(new Date(), 'yyyy-MM-dd'));
        const uniqueSlug = createUniqueSlug(baseSlug, existingSlugs);

        const { error: devotionalError } = await supabase
          .from('devotionals')
          .insert([{
            section: submission.section,
            title: submission.title,
            body: submission.body,
            scripture: submission.scripture,
            authorName: submission.writer.name,
            authorImage: submission.writer.profile_image || 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
            date: format(new Date(), 'yyyy-MM-dd'),
            slug: uniqueSlug,
          }]);

        if (devotionalError) throw devotionalError;
        setExistingSlugs(prev => [...prev, uniqueSlug]);
      }

      // Update submission status
      const { error } = await supabase
        .from('devotional_submissions')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          admin_notes: notes
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Refresh data
      fetchSubmissions();
      if (action === 'approve') {
        fetchRecentData();
      }

      alert(`Submission ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing submission:`, error);
      alert(`Error ${action}ing submission. Please try again.`);
    }
  };

  const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
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
            
            {/* Left: Dashboard + user info + sign out */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Book className="h-8 w-8 text-purple-400" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              
              {/* User info under Admin Dashboard */}
              <div className="flex flex-col ml-4">
                {user?.email && (() => {
                  const [name, domain] = user.email.split("@");

                  // If name part is less than 3 chars, show all of it then add *
                  let visiblePart = name.length >= 3 ? name.slice(0, 3) : name;
                  let masked = visiblePart + "***@" + domain;

                  return (
                    <span className="text-sm text-gray-300">
                      Welcome, {masked}
                    </span>
                  );
                })()}

                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-2 py-1 mt-1 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors w-fit"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Right: Writer link */}
            <div>
              <Link
                to="/writer/dashboard"
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Writer</span>
              </Link>
            </div>

          </div>
        </div>
      </header>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8">
          {/* Devotionals with Submissions */}
          <div className="flex flex-col">
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
            {/* Submissions under Devotionals */}
            <button
              onClick={() => setActiveTab('submissions')}
              className={`ml-6 mt-1 flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Submissions</span>
            </button>
          </div>

          {/* Moderator Cards with User Data */}
          <div className="flex flex-col">
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
            {/* User Data under Moderator Cards */}
            <button
              onClick={() => setActiveTab('data')}
              className={`ml-6 mt-1 flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === 'data'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>User Data</span>
            </button>
          </div>
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

                {/* <button
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
                </button> */}
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

        {activeTab === 'submissions' && (
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Eye className="h-6 w-6 text-blue-400" />
              <span>Devotional Submissions</span>
            </h2>

            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center p-8 text-gray-400">
                  <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet.</p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{submission.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="capitalize">{submission.section}</span>
                          <span>{format(new Date(submission.submitted_at), 'MMM dd, yyyy')}</span>
                          <div className="flex items-center space-x-2">
                            {submission.writer?.profile_image && (
                              <img
                                src={submission.writer.profile_image}
                                alt={submission.writer.name}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span>{submission.writer?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {submission.status === 'pending' && (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">Pending</span>
                          </div>
                        )}
                        {submission.status === 'approved' && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Approved</span>
                          </div>
                        )}
                        {submission.status === 'rejected' && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-300 mb-2">Scripture:</div>
                      <div className="text-purple-300 italic">"{submission.scripture}"</div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-300 mb-2">Content Preview:</div>
                      <div 
                        className="text-gray-400 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: submission.body.substring(0, 200) + '...' }}
                      />
                    </div>

                    {submission.status === 'pending' && (
                      <div className="flex items-center space-x-3 pt-4 border-t border-gray-600">
                        <button
                          onClick={() => {
                            const notes = prompt('Add admin notes (optional):');
                            handleSubmissionAction(submission.id, 'approve', notes || undefined);
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve & Post</span>
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt('Reason for rejection:');
                            if (notes) {
                              handleSubmissionAction(submission.id, 'reject', notes);
                            }
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                        >
                          <span>Preview</span>
                        </button>
                      </div>
                    )}

                    {/* Render modal if selected */}
                      {selectedSubmission && (
                        <PreviewModal
                          submission={selectedSubmission}
                          onClose={() => setSelectedSubmission(null)}
                        />
                      )}

                    {submission.admin_notes && (
                      <div className="mt-4 p-3 bg-gray-600 rounded">
                        <div className="text-sm font-medium text-gray-300 mb-1">Admin Notes:</div>
                        <div className="text-sm text-gray-400">{submission.admin_notes}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-8">
            {/* Prayer Requests */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Prayer Requests ({prayerRequests.length})</h3>
                <button
                  onClick={() => exportToExcel(prayerRequests, 'prayer-requests')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Location</th>
                      <th className="text-left p-3">Phone</th>
                      <th className="text-left p-3">Request</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prayerRequests.slice(0, 10).map((request) => (
                      <tr key={request.id} className="border-b border-gray-700">
                        <td className="p-3">{request.name}</td>
                        <td className="p-3">{request.location}</td>
                        <td className="p-3">{request.phone}</td>
                        <td className="p-3 max-w-xs truncate">{request.prayer_request}</td>
                        <td className="p-3">{format(new Date(request.created_at), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Counsel Requests */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Counsel Requests ({counselRequests.length})</h3>
                <button
                  onClick={() => exportToExcel(counselRequests, 'counsel-requests')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Phone</th>
                      <th className="text-left p-3">Problem</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counselRequests.slice(0, 10).map((request) => (
                      <tr key={request.id} className="border-b border-gray-700">
                        <td className="p-3">{request.name}</td>
                        <td className="p-3">{request.phone}</td>
                        <td className="p-3 max-w-xs truncate">{request.problem_statement}</td>
                        <td className="p-3">{format(new Date(request.created_at), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Questions */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Devotional Questions ({questions.length})</h3>
                <button
                  onClick={() => exportToExcel(questions, 'devotional-questions')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Excel</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Contact</th>
                      <th className="text-left p-3">Devotional</th>
                      <th className="text-left p-3">Question</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.slice(0, 10).map((question) => (
                      <tr key={question.id} className="border-b border-gray-700">
                        <td className="p-3">{question.name}</td>
                        <td className="p-3">{question.contact}</td>
                        <td className="p-3 max-w-xs truncate">{question.devotional?.title}</td>
                        <td className="p-3 max-w-xs truncate">{question.question}</td>
                        <td className="p-3">{format(new Date(question.created_at), 'MMM dd, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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