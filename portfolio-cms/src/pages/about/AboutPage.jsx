import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  FileText,
  Image as ImageIcon,
  Save,
  Loader2,
  ExternalLink,
  Eye,
  RefreshCw,
} from 'lucide-react';
import aboutService from '../../services/aboutService';
import { useToast } from '../../context/ToastContext';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import MediaPicker from '../../components/MediaPicker';

export const AboutPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    profileImage: '',
    resumeUrl: '',
    email: '',
    location: '',
  });

  const fetchAbout = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aboutService.getAbout();
      if (data) {
        setFormData({
          name: data.name || '',
          headline: data.headline || '',
          bio: data.bio || '',
          profileImage: data.profileImage || '',
          resumeUrl: data.resumeUrl || '',
          email: data.email || '',
          location: data.location || '',
        });
      }
    } catch (err) {
      console.error('Error fetching about data:', err);
      // If 404, profile not configured yet; otherwise true error
      if (err.response?.status !== 404) {
        setError('Failed to load profile details from the server. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await aboutService.updateAbout(formData);
      toast.success('Profile information saved and published successfully!');
    } catch (err) {
      console.error('Failed to update about profile:', err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save profile. Please ensure all required fields are valid.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading profile information..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Could Not Load Profile"
        message={error}
        onRetry={fetchAbout}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">About & Profile</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your personal portfolio bio, avatar, resume URL, and contact details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAbout}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Edit Form */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Alex Sterling"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Professional Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Headline / Designation *
              </label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                required
                placeholder="e.g. Principal Distributed Systems Architect & Full-Stack Engineer"
                className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Location / City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Resume Download URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/resume.pdf"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Profile Image URL
                </label>
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose from Media Library</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/... or media library link"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Comprehensive Biography *
              </label>
              <textarea
                name="bio"
                rows={6}
                value={formData.bio}
                onChange={handleChange}
                required
                placeholder="Write your professional story, technical background, and achievements..."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all resize-y"
              />
            </div>
          </form>
        </div>

        {/* Live Profile Card Preview */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Public Card Preview
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-indigo-500/40 p-1 mb-4 shadow-xl shadow-indigo-950/50 overflow-hidden">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt={formData.name || 'Profile'}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-950/40 text-indigo-300 font-bold text-2xl">
                    {formData.name ? formData.name.charAt(0) : '?'}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">
                {formData.name || 'Your Full Name'}
              </h3>
              <p className="text-xs font-medium text-indigo-400 mt-0.5">
                {formData.headline || 'Your Headline or Title'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                {formData.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {formData.location}
                  </span>
                )}
                {formData.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {formData.email}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-4 line-clamp-5 text-left p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 w-full">
                {formData.bio || 'Your bio preview will appear here as you type.'}
              </p>

              {formData.resumeUrl && (
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download Resume PDF</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reusable MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setFormData((prev) => ({ ...prev, profileImage: url }))}
        title="Choose Profile Headshot"
      />
    </div>
  );
};

export default AboutPage;
