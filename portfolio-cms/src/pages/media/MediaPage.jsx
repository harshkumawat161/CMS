import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Trash2,
  Check,
  Search,
  Loader2,
  RefreshCw,
  Eye,
  Calendar,
  HardDrive,
  FileCode,
  FolderOpen,
} from 'lucide-react';
import mediaService from '../../services/mediaService';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import Pagination from '../../components/Pagination';
import { useToast } from '../../context/ToastContext';
import { formatBytes, formatDate } from '../../utils/formatters';

export const MediaPage = () => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Preview modal
  const [previewMedia, setPreviewMedia] = useState(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mediaService.getAllMedia();
      setMediaList(data || []);
    } catch (err) {
      console.error('Error fetching media assets:', err);
      setError('Could not retrieve media assets from the backend.');
      toast.error('Failed to load media assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File exceeds maximum upload size (10 MB).');
      return;
    }

    setUploading(true);
    try {
      await mediaService.uploadMedia(file, file.name);
      toast.success(`"${file.name}" uploaded successfully!`);
      fetchMedia();
    } catch (err) {
      console.error('Media upload failed:', err);
      const msg = err.response?.data?.message || 'Failed to upload media file.';
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCopyUrl = (item) => {
    const fullUrl = item.url.startsWith('http')
      ? item.url
      : `http://localhost:8080${item.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    toast.success('Media URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteMedia = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await mediaService.deleteMedia(deleteTarget.id);
      toast.success(`Media asset "${deleteTarget.originalFilename}" removed.`);
      if (previewMedia && previewMedia.id === deleteTarget.id) {
        setPreviewMedia(null);
      }
      setDeleteTarget(null);
      fetchMedia();
    } catch (err) {
      console.error('Failed to delete media:', err);
      toast.error('Failed to delete media asset.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.originalFilename?.toLowerCase().includes(q) ||
      m.generatedFilename?.toLowerCase().includes(q) ||
      m.contentType?.toLowerCase().includes(q)
    );
  });

  // Calculate paginated slice
  const totalItems = filteredMedia.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Media Storage Library</h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload images, preview media, copy asset URLs, and manage storage resources
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? 'Uploading Asset...' : 'Upload File'}</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-3xl bg-slate-900/40 hover:bg-slate-900/60 transition-all cursor-pointer text-center group"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110">
          <Upload className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-200">
          Drop your image here or <span className="text-indigo-400 underline">browse computer</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports JPEG, PNG, WEBP, SVG up to 10 MB. Files are stored on backend and served via direct URLs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by filename or content-type..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* UX Content States */}
      {loading ? (
        <LoadingState message="Loading media storage assets..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMedia} />
      ) : filteredMedia.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={search ? 'No matching media assets' : 'Media library is empty'}
          description={
            search
              ? 'Try modifying your search criteria.'
              : 'Upload your first image asset to use across projects, articles, and profile.'
          }
          actionLabel="Upload Media"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="space-y-4">
          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedMedia.map((item) => {
              const fullUrl = item.url.startsWith('http')
                ? item.url
                : `http://localhost:8080${item.url}`;

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 overflow-hidden backdrop-blur-md transition-all hover:shadow-xl flex flex-col"
                >
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={fullUrl}
                      alt={item.originalFilename}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 shadow-lg"
                        title="Preview Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopyUrl(item)}
                        className="p-2 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 shadow-lg"
                        title="Copy Direct URL"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata Card Footer */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p
                        className="text-xs font-semibold text-white truncate"
                        title={item.originalFilename}
                      >
                        {item.originalFilename}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{formatBytes(item.size || item.fileSize)}</span>
                        <span className="font-mono truncate max-w-[110px]">
                          {item.contentType}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        <span>Uploaded: {formatDate(item.createdAt || item.uploadedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                      <button
                        onClick={() => handleCopyUrl(item)}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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

      {/* Asset Preview Modal */}
      <Modal
        isOpen={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
        title={previewMedia?.originalFilename || 'Media Asset Preview'}
        subtitle="Full image preview, file metrics, and direct URL copy"
        maxWidth="max-w-3xl"
      >
        {previewMedia && (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[50vh] flex items-center justify-center p-2">
              <img
                src={
                  previewMedia.url.startsWith('http')
                    ? previewMedia.url
                    : `http://localhost:8080${previewMedia.url}`
                }
                alt={previewMedia.originalFilename}
                className="max-h-[46vh] w-auto object-contain rounded-xl"
              />
            </div>

            {/* Detailed File Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  File Size
                </span>
                <span className="font-semibold text-slate-200">
                  {formatBytes(previewMedia.size || previewMedia.fileSize)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  MIME Format
                </span>
                <span className="font-semibold text-slate-200 font-mono">
                  {previewMedia.contentType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Upload Date
                </span>
                <span className="font-semibold text-slate-200">
                  {formatDate(previewMedia.createdAt || previewMedia.uploadedAt)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Storage
                </span>
                <span className="font-semibold text-emerald-400">Local Disk</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 break-all">
              {previewMedia.url.startsWith('http')
                ? previewMedia.url
                : `http://localhost:8080${previewMedia.url}`}
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setDeleteTarget(previewMedia)}
                className="px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-rose-500/20"
              >
                Delete File
              </button>

              <button
                onClick={() => handleCopyUrl(previewMedia)}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Media URL</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media Asset?"
        message={`Are you sure you want to delete "${deleteTarget?.originalFilename}"? Any pages or articles referencing this file URL will be affected.`}
        confirmText="Delete Asset"
        loading={deleting}
        onConfirm={handleDeleteMedia}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default MediaPage;
