import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Loader2,
  RefreshCw,
  Send,
  EyeOff,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import blogService from '../../services/blogService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';
import MediaPicker from '../../components/MediaPicker';
import { useToast } from '../../context/ToastContext';

export const BlogsPage = () => {
  const toast = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    status: 'PUBLISHED',
  });

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Could not retrieve blog articles from the server.');
      toast.error('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: titleVal,
      slug: !editingBlog ? generateSlug(titleVal) : prev.slug,
    }));
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      status: 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      status: blog.status || 'PUBLISHED',
    });
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    try {
      if (editingBlog) {
        await blogService.updateBlog(editingBlog.id, form);
        toast.success(`Article "${form.title}" updated successfully.`);
      } else {
        await blogService.createBlog(form);
        toast.success(`Article "${form.title}" created successfully.`);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to save blog:', err);
      const msg = err.response?.data?.message || 'Error saving blog article.';
      toast.error(msg);
    } finally {
      setModalSaving(false);
    }
  };

  const handlePublish = async (blog) => {
    try {
      await blogService.publishBlog(blog.id);
      toast.success(`Article "${blog.title}" published!`);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to publish article:', err);
      toast.error('Failed to publish article.');
    }
  };

  const handleUnpublish = async (blog) => {
    try {
      await blogService.unpublishBlog(blog.id);
      toast.info(`Article "${blog.title}" moved to draft.`);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to unpublish article:', err);
      toast.error('Failed to unpublish article.');
    }
  };

  const handleDeleteBlog = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await blogService.deleteBlog(deleteTarget.id);
      toast.success(`Article "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog:', err);
      toast.error('Failed to delete article.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Blog Articles</h2>
          <p className="text-sm text-slate-400 mt-1">
            Write, organize, and publish technical articles and insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBlogs}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or slug..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'PUBLISHED', 'DRAFT'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading blog publications..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBlogs} />
      ) : filteredBlogs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? 'No matching articles' : 'No articles published yet'}
          description={
            search
              ? 'Try modifying your search criteria or status filter.'
              : 'Write and publish your first technical article or engineering insight.'
          }
          actionLabel="Create Article"
          onAction={openCreateModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{blog.title}</div>
                          <div className="text-xs font-mono text-slate-400 mb-0.5">
                            /blogs/{blog.slug}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                            {blog.excerpt || 'No excerpt summary provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={blog.status} />
                    </td>

                    {/* Published Date */}
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {blog.publishedAt
                            ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'Unpublished'}
                        </span>
                      </div>
                    </td>

                    {/* Actions: Create, Edit, Delete, Publish, Unpublish */}
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {blog.status === 'PUBLISHED' ? (
                          <button
                            onClick={() => handleUnpublish(blog)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors flex items-center gap-1"
                            title="Unpublish Article"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Unpublish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePublish(blog)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1"
                            title="Publish Article"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(blog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Blog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlog ? 'Edit Blog Article' : 'Compose New Article'}
        subtitle="Manage title, slug, excerpt preview, and full markdown body"
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveBlog} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="e.g. Architecting Scalable Reactive Microservices"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="architecting-scalable-reactive-microservices"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Excerpt Summary *
            </label>
            <textarea
              rows={2}
              required
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Concise overview or lead paragraph for card previews..."
              className="w-full px-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Cover Image URL
              </label>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold hover:underline flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Choose Media</span>
              </button>
            </div>
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://images.unsplash.com/... or media library URL"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Article Body (Markdown supported) *
            </label>
            <textarea
              rows={8}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write complete article contents here..."
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none font-mono text-xs leading-relaxed resize-y"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full max-w-xs px-3.5 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            >
              <option value="PUBLISHED">PUBLISHED (Publicly visible)</option>
              <option value="DRAFT">DRAFT (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalSaving}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              {modalSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{editingBlog ? 'Save Article' : 'Publish Article'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Article?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Delete Article"
        loading={deleting}
        onConfirm={handleDeleteBlog}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Reusable MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
        title="Choose Article Cover Image"
      />
    </div>
  );
};

export default BlogsPage;
