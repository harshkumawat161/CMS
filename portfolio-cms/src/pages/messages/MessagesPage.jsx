import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Mail,
  MailOpen,
  Search,
  Trash2,
  Calendar,
  User,
  RefreshCw,
  Send,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import messageService from '../../services/messageService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

export const MessagesPage = () => {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Detail Modal
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await messageService.getAllMessages();
      setMessages(data || []);
      if (isManual) toast.success('Inbox synchronized with server.');
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      setError('Could not retrieve contact messages from the server.');
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg, e) => {
    if (e) e.stopPropagation();
    try {
      const nextState = !msg.read;
      await messageService.markMessageAsRead(msg.id, nextState);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: nextState } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage((prev) => ({ ...prev, read: nextState }));
      }
      toast.info(nextState ? 'Marked inquiry as read.' : 'Marked inquiry as unread.');
    } catch (err) {
      console.error('Failed to update read status:', err);
      toast.error('Failed to update message status.');
    }
  };

  const handleOpenDetail = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await messageService.markMessageAsRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
        setSelectedMessage({ ...msg, read: true });
      } catch (err) {
        console.error('Error auto-marking read:', err);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await messageService.deleteMessage(deleteTarget.id);
      toast.success('Inquiry permanently deleted.');
      if (selectedMessage && selectedMessage.id === deleteTarget.id) {
        setSelectedMessage(null);
      }
      setDeleteTarget(null);
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error('Failed to delete inquiry.');
    } finally {
      setDeleting(false);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);

    if (filter === 'UNREAD') return matchesSearch && !m.read;
    if (filter === 'READ') return matchesSearch && m.read;
    return matchesSearch;
  });

  const totalItems = filteredMessages.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Contact Inquiries</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Incoming contact form messages, inquiries, and communication requests
          </p>
        </div>

        <button
          onClick={() => fetchMessages(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search inquiries by sender, email, subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'UNREAD', 'READ'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {f === 'UNREAD' && unreadCount > 0 ? `UNREAD (${unreadCount})` : f}
            </button>
          ))}
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading inquiry messages..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMessages} />
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={search ? 'No matching inquiries' : 'Your inbox is clear'}
          description={
            search
              ? 'Try modifying your search query or filter selection.'
              : 'New contact form messages submitted by visitors will arrive here in real time.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <div className="divide-y divide-slate-800/60">
            {paginatedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenDetail(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${
                  !msg.read
                    ? 'bg-indigo-950/25 hover:bg-indigo-950/40 border-l-4 border-l-indigo-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                {/* Sender & Subject Summary */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      !msg.read ? 'bg-indigo-400 ring-4 ring-indigo-500/20 animate-pulse' : 'bg-slate-700'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-semibold truncate ${
                          !msg.read ? 'text-white font-bold' : 'text-slate-300'
                        }`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        &lt;{msg.email}&gt;
                      </span>
                      {!msg.read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          New
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-sm mb-1 truncate ${
                        !msg.read ? 'text-indigo-200 font-semibold' : 'text-slate-400 font-medium'
                      }`}
                    >
                      {msg.subject}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(msg.createdAt, { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenDetail(msg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="View Message"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleToggleRead(msg, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.read ? (
                        <Mail className="w-4 h-4 text-slate-400" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-indigo-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(msg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Message Detail View Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Inquiry Details'}
        subtitle="Contact inquiry full body and reply actions"
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-200">{selectedMessage.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-indigo-400 hover:underline font-mono"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Inquiry Message
              </label>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[140px]">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => setDeleteTarget(selectedMessage)}
                className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
              >
                Delete Inquiry
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleRead(selectedMessage)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
                >
                  {selectedMessage.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inquiry Message?"
        message={`Are you sure you want to permanently delete the inquiry from "${deleteTarget?.name}"?`}
        confirmText="Delete Message"
        loading={deleting}
        onConfirm={handleDeleteMessage}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MessagesPage;
