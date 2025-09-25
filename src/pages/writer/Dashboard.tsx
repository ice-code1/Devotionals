import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Writer, DevotionalSubmission } from '../../lib/supabase';
import RichTextEditor from '../../components/RichTextEditor';
import { format } from 'date-fns';
import { 
  PenTool, 
  LogOut, 
  User, 
  Send, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function WriterDashboard() {
  const { user, signOut, loading } = useAuth();
  const [writer, setWriter] = useState<Writer | null>(null);
  const [submissions, setSubmissions] = useState<DevotionalSubmission[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    profile_image: '',
    bio: ''
  });
  
  // Devotional form state
  const [devotionalForm, setDevotionalForm] = useState({
    section: 'children' as 'children' | 'teenagers',
    title: '',
    body: '',
    scripture: '',
  });
  
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingDevotional, setIsSubmittingDevotional] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWriterProfile();
      fetchSubmissions();
    }
  }, [user]);

  const fetchWriterProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('writers')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setWriter(data);
        setProfileForm({
          name: data.name,
          profile_image: data.profile_image || '',
          bio: data.bio || ''
        });
      } else {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error('Error fetching writer profile:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('devotional_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProfile(true);

    try {
      const profileData = {
        ...profileForm,
        user_id: user?.id
      };

      if (writer) {
        const { error } = await supabase
          .from('writers')
          .update(profileData)
          .eq('id', writer.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('writers')
          .insert([profileData])
          .select()
          .single();
        if (error) throw error;
        setWriter(data);
      }

      setShowProfileForm(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleDevotionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!writer) return;

    setIsSubmittingDevotional(true);

    try {
      const { data, error } = await supabase
        .from('devotional_submissions')
        .insert([{
          ...devotionalForm,
          writer_id: writer.id
        }])
        .select()
        .single();

      if (error) throw error;

      setSubmissions(prev => [data, ...prev]);
      setDevotionalForm({
        section: 'children',
        title: '',
        body: '',
        scripture: '',
      });

      alert('Devotional submitted successfully! It will be reviewed by an admin.');
    } catch (error) {
      console.error('Error submitting devotional:', error);
      alert('Error submitting devotional. Please try again.');
    } finally {
      setIsSubmittingDevotional(false);
    }
  };

  const copyReviewLink = (reviewLink: string) => {
    const fullUrl = `${window.location.origin}/review/${reviewLink}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Review link copied to clipboard!');
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

  if (showProfileForm || !writer) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <PenTool className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-bold">Writer Dashboard</h1>
              </div>
              
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-2xl p-8">
            <div className="text-center mb-8">
              <User className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold mb-2">Complete Your Writer Profile</h2>
              <p className="text-gray-400">Set up your profile to start submitting devotionals</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const fileName = `${Date.now()}-${file.name}`;
                    const { data, error } = await supabase.storage
                      .from('media')
                      .upload(fileName, file, { upsert: true });

                    if (error) {
                      console.error('Upload failed:', error.message);
                      alert('Error uploading profile image.');
                      return;
                    }

                    // Get public URL
                    const { data: { publicUrl } } = supabase.storage
                      .from('DevotionalImages')
                      .getPublicUrl(fileName);

                    setProfileForm(prev => ({ ...prev, profile_image: publicUrl }));
                  }}
                  className="w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself and your writing background..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmittingProfile ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
     {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Left: Dashboard title */}
            <div className="flex items-center space-x-2">
              <PenTool className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Writer Dashboard</h1>
            </div>

            {/* Right: Writer info + actions */}
            <div className="flex items-center space-x-6">
              
              {/* Profile Image + Masked Name */}
              <div className="flex items-center space-x-3">
                {writer.profile_image && (
                  <img
                    src={writer.profile_image}
                    alt={writer.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                  />
                )}

                {/* Masked Name */}
                <span className="text-base text-gray-300 font-medium">
                  {(() => {
                    if (!writer?.name) return "";
                    const parts = writer.name.trim().split(" ");
                    const firstName = parts[0] || "";
                    const lastName = parts[parts.length - 1] || "";
                    return `${firstName.charAt(0).toUpperCase()}.${lastName}`;
                  })()}
                </span>
              </div>

              {/* Edit Profile + Sign Out stacked */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit Profile
                </button>
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
        </div>
      </header>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Submit Devotional Form */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Send className="h-6 w-6 text-green-400" />
              <span>Submit New Devotional</span>
            </h2>

            <form onSubmit={handleDevotionalSubmit} className="space-y-4">
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="children">Children</option>
                  <option value="teenagers">Teenagers</option>
                </select>
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Bible verse"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Body
                </label>
                <RichTextEditor
                  content={devotionalForm.body}
                  onChange={(content) => setDevotionalForm(prev => ({ ...prev, body: content }))}
                  placeholder="Write your devotional content here..."
                />
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
                    <Send className="h-5 w-5" />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* My Submissions */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">My Submissions</h3>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1 sm:pr-2">
              {submissions.length === 0 ? (
                <div className="text-center p-8 text-gray-400">
                  <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet. Submit your first devotional!</p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{submission.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="capitalize">{submission.section}</span>
                          <span>{format(new Date(submission.submitted_at), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {submission.status === 'pending' && (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Pending</span>
                          </div>
                        )}
                        {submission.status === 'approved' && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Approved</span>
                          </div>
                        )}
                        {submission.status === 'rejected' && (
                          <div className="flex items-center space-x-1 text-red-400">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs">Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ✅ Rich Text Body */}
                    <div
                      className="prose prose-sm max-w-none text-gray-300 mt-3"
                      dangerouslySetInnerHTML={{ __html: submission.body }}
                    />

                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mt-3">
                      <button
                        onClick={() => copyReviewLink(submission.review_link)}
                        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Review Link</span>
                      </button>
                      <a
                        href={`/review/${submission.review_link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-xs"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Preview</span>
                      </a>
                    </div>

                    {submission.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-600 rounded text-sm">
                        <div className="font-medium text-gray-300 mb-1">Admin Notes:</div>
                        <div className="text-gray-400">{submission.admin_notes}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}