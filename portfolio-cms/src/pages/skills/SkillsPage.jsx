import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import skillService from '../../services/skillService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../context/ToastContext';

export const SkillsPage = () => {
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    category: 'Backend',
    proficiency: 85,
    icon: 'code',
    displayOrder: 1,
    published: true,
  });

  const categories = ['ALL', 'Frontend', 'Backend', 'DevOps', 'Database', 'Tools', 'Languages'];

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await skillService.getAllSkills();
      setSkills(data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Could not retrieve technical skills from the backend.');
      toast.error('Failed to load skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setForm({
      name: '',
      category: 'Backend',
      proficiency: 85,
      icon: 'code',
      displayOrder: skills.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || 'code',
      displayOrder: skill.displayOrder,
      published: skill.published !== undefined ? skill.published : true,
    });
    setIsModalOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    try {
      if (editingSkill) {
        await skillService.updateSkill(editingSkill.id, form);
        toast.success(`Skill "${form.name}" updated successfully.`);
      } else {
        await skillService.createSkill(form);
        toast.success(`Skill "${form.name}" created successfully.`);
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      console.error('Failed to save skill:', err);
      const msg = err.response?.data?.message || 'Error saving skill.';
      toast.error(msg);
    } finally {
      setModalSaving(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await skillService.deleteSkill(deleteTarget.id);
      toast.success(`Skill "${deleteTarget.name}" deleted permanently.`);
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
      toast.error('Failed to delete skill from server.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredSkills = skills.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Technical Skills</h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure technical proficiencies, display ordering, and visibility
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSkills}
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
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading skills repository..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSkills} />
      ) : filteredSkills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title={search ? 'No matching skills' : 'No skills configured yet'}
          description={
            search
              ? 'Try adjusting your search query or category filters.'
              : 'Add your first technical skill and proficiency rating.'
          }
          actionLabel="Add Skill"
          onAction={openCreateModal}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Skill Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Proficiency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold uppercase">
                        {skill.name.substring(0, 2)}
                      </div>
                      <span>{skill.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-36">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-slate-400">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isPublished={skill.published} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(skill)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Skill"
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

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill Details' : 'Add New Skill'}
        subtitle="Manage competency level, technology tag, and ordering"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. React 19, Spring Boot, PostgreSQL"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Database">Database</option>
                <option value="Languages">Languages</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({ ...form, displayOrder: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Proficiency ({form.proficiency}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={form.proficiency}
              onChange={(e) =>
                setForm({ ...form, proficiency: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Icon Identifier / Class
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. react, coffee, database, container"
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
              />
              <span className="text-sm font-medium text-slate-300">
                Publish immediately (Visible in public portfolio API)
              </span>
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
              <span>{editingSkill ? 'Save Changes' : 'Create Skill'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Technical Skill?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"?`}
        confirmText="Delete Skill"
        loading={deleting}
        onConfirm={handleDeleteSkill}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SkillsPage;
