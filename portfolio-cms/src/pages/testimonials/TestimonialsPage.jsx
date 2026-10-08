import React, { useState, useEffect } from 'react';
import {
  Quote,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import testimonialService from '../../services/testimonialService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';
import MediaPicker from '../../components/MediaPicker';
import { useToast } from '../../context/ToastContext';

export const TestimonialsPage = () => {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    image: '',
    displayOrder: 1,
    published: true,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Could not retrieve testimonials from the backend.');
      toast.error('Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setForm({
      name: '',
      role: '',
      company: '',
      message: '',
      image: '',
      displayOrder: testimonials.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingTestimonial(item);
    setForm({
      name: item.name,
      role: item.role,
      company: item.company || '',
      message: item.message,
      image: item.image || '',
      displayOrder: item.displayOrder || 1,
      published: item.published !== undefined ? item.published : true,
    });
    setIsModalOpen(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    try {
      if (editingTestimonial) {
        await testimonialService.updateTestimonial(editingTestimonial.id, form);
        toast.success(`Testimonial from "${form.name}" updated successfully.`);
      } else {
        await testimonialService.createTestimonial(form);
        toast.success(`Testimonial from "${form.name}" added successfully.`);
      }
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to save testimonial:', err);
      const msg = err.response?.data?.message || 'Error saving testimonial.';
      toast.error(msg);
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await testimonialService.deleteTestimonial(deleteTarget.id);
      toast.success(`Testimonial from "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      toast.error('Failed to delete testimonial.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Client Testimonials</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage peer endorsements, client reviews, and testimonials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTestimonials}
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
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by author, role, or company..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading testimonials and reviews..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTestimonials} />
      ) : filteredTestimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title={search ? 'No matching endorsements' : 'No testimonials recorded'}
          description={
            search
              ? 'Try modifying your search keywords.'
              : 'Add quotes and recommendations from clients and colleagues.'
          }
          actionLabel="Add Testimonial"
          onAction={openCreateModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Endorser</th>
                  <th className="px-6 py-4">Testimonial Message</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTestimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-full object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {item.role} {item.company && `at ${item.company}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-300 italic max-w-md line-clamp-2">
                        "{item.message}"
                      </p>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      #{item.displayOrder}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge isPublished={item.published} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Testimonial"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Testimonial"
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

      {/* Add / Edit Testimonial Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        subtitle="Manage author identity, role, quote, and avatar image"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveTestimonial} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Author Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Position / Role *
              </label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. VP of Engineering"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. TechCorp Global"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Avatar / Headshot URL
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
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/... or media library link"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Testimonial Quote *
            </label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write the recommendation or endorsement message..."
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                />
                <span className="text-xs font-semibold text-slate-300">Publicly Visible</span>
              </label>
            </div>
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
              <span>{editingTestimonial ? 'Save Changes' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message={`Are you sure you want to permanently delete the endorsement from "${deleteTarget?.name}"?`}
        confirmText="Delete Testimonial"
        loading={deleting}
        onConfirm={handleDeleteTestimonial}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Reusable MediaPicker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setForm((prev) => ({ ...prev, image: url }))}
        title="Choose Testimonial Avatar"
      />
    </div>
  );
};

export default TestimonialsPage;
