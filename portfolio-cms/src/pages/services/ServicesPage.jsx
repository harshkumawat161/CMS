import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import serviceService from '../../services/serviceService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const ServicesPage = () => {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: 'sparkles',
    displayOrder: 1,
    published: true,
  });

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceService.getAllServices();
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Could not load service offerings from the server.');
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setForm({
      title: '',
      description: '',
      icon: 'sparkles',
      displayOrder: services.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (svc) => {
    setEditingService(svc);
    setForm({
      title: svc.title,
      description: svc.description,
      icon: svc.icon || 'sparkles',
      displayOrder: svc.displayOrder || 1,
      published: svc.published !== undefined ? svc.published : true,
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    try {
      if (editingService) {
        await serviceService.updateService(editingService.id, form);
        toast.success(`Service "${form.title}" updated successfully.`);
      } else {
        await serviceService.createService(form);
        toast.success(`Service "${form.title}" created successfully.`);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Failed to save service:', err);
      const msg = err.response?.data?.message || 'Error saving service offering.';
      toast.error(msg);
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await serviceService.deleteService(deleteTarget.id);
      toast.success(`Service "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      console.error('Failed to delete service:', err);
      toast.error('Failed to delete service.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = services.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Services & Offerings</h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure solutions, architectural consulting, and freelance offerings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServices}
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
            <span>Add Service</span>
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
            placeholder="Search services by title or description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading service offerings..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchServices} />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title={search ? 'No matching services' : 'No service offerings configured'}
          description={
            search
              ? 'Try modifying your search keywords.'
              : 'Add consulting packages or client solutions to highlight your expertise.'
          }
          actionLabel="Add Service"
          onAction={openCreateModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Service Offering</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span>{svc.title}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-400 max-w-md line-clamp-2">
                        {svc.description}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      #{svc.displayOrder}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge isPublished={svc.published} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(svc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(svc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service Offering' : 'Add Service Offering'}
        subtitle="Manage title, deliverable description, icon, and display sequence"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveService} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Cloud Architecture & Scalability"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed breakdown of deliverables, technical stack, and outcomes..."
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Icon Identifier
              </label>
              <input
                type="text"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="e.g. sparkles, cloud, cpu"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

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
          </div>

          <div className="pt-2">
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
              <span>{editingService ? 'Save Changes' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Service Offering?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Delete Service"
        loading={deleting}
        onConfirm={handleDeleteService}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ServicesPage;
