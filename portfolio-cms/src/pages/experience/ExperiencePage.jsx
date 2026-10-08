import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Building,
  Loader2,
  RefreshCw,
  Clock,
  LayoutList,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';
import experienceService from '../../services/experienceService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useToast } from '../../context/ToastContext';

export const ExperiencePage = () => {
  const toast = useToast();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: '',
    displayOrder: 1,
    published: true,
  });

  const fetchExperiences = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await experienceService.getAllExperience();
      setExperiences(data || []);
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Could not load work history from the server.');
      toast.error('Failed to load career history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setForm({
      company: '',
      position: '',
      description: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      current: true,
      technologies: '',
      displayOrder: experiences.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    const techString = Array.isArray(exp.technologies)
      ? exp.technologies.join(', ')
      : exp.technologies || '';
    setForm({
      company: exp.company,
      position: exp.position,
      description: exp.description || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      technologies: techString,
      displayOrder: exp.displayOrder || 1,
      published: exp.published !== undefined ? exp.published : true,
    });
    setIsModalOpen(true);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    try {
      const techList = form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        company: form.company,
        position: form.position,
        description: form.description,
        startDate: form.startDate,
        endDate: form.current ? null : form.endDate || null,
        current: form.current,
        technologies: techList,
        displayOrder: form.displayOrder,
        published: form.published,
      };

      if (editingExp) {
        await experienceService.updateExperience(editingExp.id, payload);
        toast.success(`Role at "${form.company}" updated.`);
      } else {
        await experienceService.createExperience(payload);
        toast.success(`Experience at "${form.company}" added.`);
      }
      setIsModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error('Failed to save experience:', err);
      const msg = err.response?.data?.message || 'Error saving experience record.';
      toast.error(msg);
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteExperience = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await experienceService.deleteExperience(deleteTarget.id);
      toast.success(`Role at "${deleteTarget.company}" removed permanently.`);
      setDeleteTarget(null);
      fetchExperiences();
    } catch (err) {
      console.error('Failed to delete experience:', err);
      toast.error('Failed to delete experience.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredExperiences = experiences.filter((item) => {
    const matchesSearch =
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase()) ||
      (item.technologies &&
        item.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Work Experience</h2>
          <p className="text-sm text-slate-400 mt-1">
            Timeline-style career journey, positions, achievements, and technical stack
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchExperiences}
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
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, role, or technology..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'timeline'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'table'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading career timeline..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchExperiences} />
      ) : filteredExperiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={search ? 'No matching roles' : 'No experience history recorded'}
          description={
            search
              ? 'Try modifying your search query.'
              : 'Add your career positions to build your interactive timeline.'
          }
          actionLabel="Add Experience"
          onAction={openCreateModal}
        />
      ) : viewMode === 'timeline' ? (
        /* Timeline View */
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/40 before:to-transparent">
          {filteredExperiences.map((exp, index) => (
            <div key={exp.id} className="relative group">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[27px] sm:-left-[29px] top-4 w-5 h-5 rounded-full border-4 border-slate-950 flex items-center justify-center transition-transform group-hover:scale-125 ${
                  exp.current ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-indigo-500 ring-4 ring-indigo-500/20'
                }`}
              />

              {/* Card Container */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 backdrop-blur-xl shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {exp.position}
                      </h3>
                      {exp.current && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current Role
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium">
                      <Building className="w-4 h-4 text-indigo-400" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {exp.startDate} → {exp.current ? 'Present' : exp.endDate || 'N/A'}
                      </span>
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit Position"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Position"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}

                {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {exp.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Company & Position</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Technologies</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredExperiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{exp.position}</span>
                          {exp.current && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Present
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3.5 h-3.5" />
                          <span>{exp.company}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {exp.startDate} → {exp.current ? 'Present' : exp.endDate || 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Array.isArray(exp.technologies) &&
                          exp.technologies.slice(0, 3).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
                            >
                              {t}
                            </span>
                          ))}
                        {Array.isArray(exp.technologies) && exp.technologies.length > 3 && (
                          <span className="text-[11px] text-slate-500">
                            +{exp.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      #{exp.displayOrder}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Position"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Position"
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

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExp ? 'Edit Experience Position' : 'Add Experience Position'}
        subtitle="Manage company, role, timeline dates, and impact description"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveExperience} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Stripe, Amazon, Google"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Job Title / Position *
              </label>
              <input
                type="text"
                required
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="e.g. Lead Distributed Architect"
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                disabled={form.current}
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none disabled:opacity-40"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.current}
                onChange={(e) =>
                  setForm({
                    ...form,
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : form.endDate,
                  })
                }
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
              />
              <span className="text-xs font-medium text-slate-300">
                Currently working in this role (Present)
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="Java, Kubernetes, Spring Cloud, Docker, Kafka"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description & Key Impact
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe accomplishments, leadership, technical impact..."
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
              <span>{editingExp ? 'Save Changes' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Work Experience?"
        message={`Are you sure you want to permanently delete your role at "${deleteTarget?.company}"?`}
        confirmText="Delete Record"
        loading={deleting}
        onConfirm={handleDeleteExperience}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ExperiencePage;
