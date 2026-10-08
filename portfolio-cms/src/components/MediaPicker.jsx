import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Check,
  Loader2,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import mediaService from '../services/mediaService';
import Modal from './Modal';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { useToast } from '../context/ToastContext';
import { formatBytes } from '../utils/formatters';

export const MediaPicker = ({
  isOpen,
  onClose,
  onSelect,
  title = 'Select Media Asset',
}) => {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mediaService.getAllMedia();
      setMediaList(data || []);
    } catch (err) {
      console.error('MediaPicker load error:', err);
      setError('Could not load media library assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItem(null);
      setSearch('');
    }
  }, [isOpen]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10 MB limit.');
      return;
    }

    setUploading(true);
    try {
      const uploaded = await mediaService.uploadMedia(file, file.name);
      toast.success(`"${file.name}" uploaded successfully!`);
      await fetchMedia();
      if (uploaded) {
        setSelectedItem(uploaded);
      }
    } catch (err) {
      console.error('MediaPicker upload error:', err);
      toast.error('Upload failed. Check server connection.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmSelect = () => {
    if (!selectedItem) return;
    const finalUrl = selectedItem.url.startsWith('http')
      ? selectedItem.url
      : `http://localhost:8080${selectedItem.url}`;

    onSelect(finalUrl, selectedItem);
    onClose();
  };

  const filtered = mediaList.filter((m) =>
    m.originalFilename?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Select an existing file from the media repository or upload a new one"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-4">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by filename..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMedia}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
              title="Refresh Media List"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
            </button>
          </div>
        </div>

        {/* Gallery Content Area */}
        <div className="min-h-[320px] max-h-[420px] overflow-y-auto pr-1">
          {loading ? (
            <LoadingState message="Loading media files..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchMedia} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              title={search ? 'No matching assets' : 'No media assets uploaded'}
              description={
                search
                  ? 'Try a different filename search keyword.'
                  : 'Upload an image above to use it across your portfolio.'
              }
              actionLabel="Upload Image"
              onAction={() => fileInputRef.current?.click()}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {filtered.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const fullUrl = item.url.startsWith('http')
                  ? item.url
                  : `http://localhost:8080${item.url}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative rounded-2xl border cursor-pointer overflow-hidden transition-all bg-slate-950/60 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/60'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="aspect-square relative bg-slate-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={fullUrl}
                        alt={item.originalFilename}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />

                      {/* Selected checkmark overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-slate-200 truncate" title={item.originalFilename}>
                        {item.originalFilename}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {formatBytes(item.size || item.fileSize)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Item Summary & Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 truncate max-w-sm">
            {selectedItem ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-200 font-medium truncate">
                  Selected: {selectedItem.originalFilename}
                </span>
              </span>
            ) : (
              <span>Click any image to select it</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedItem}
              onClick={handleConfirmSelect}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              Apply Media Asset
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MediaPicker;
