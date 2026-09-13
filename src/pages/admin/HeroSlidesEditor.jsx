// src/pages/admin/HeroSlidesEditor.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  Upload,
  Video as VideoIcon,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/firestore';
import { Field, Input } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';
import { uploadImage } from '../../services/cloudinary';

const emptySlide = {
  type: 'image',
  src: '',
  poster: '',
  title: '',
  description: '',
  order: 1,
};

/* ============================================================
   VideoUploader — dashed upload box for videos
   ============================================================ */
const VideoUploader = ({ value, onChange, label = 'Slide Video' }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    try {
      setUploading(true);
      const result = await uploadImage(file); // auto-detects video
      onChange(result.secure_url);
      toast.success('Video uploaded');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Video upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label}
      </label>

      {value ? (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden bg-black border border-gray-200">
            <video
              key={value}
              src={value}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-64 object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Replace video
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={uploading}
              className="px-3 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-xs">Uploading video...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">Click to upload video</span>
              <span className="text-[10px] text-gray-400">
                MP4, MOV, WEBM
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
};

/* ============================================================
   HeroSlidesEditor
   ============================================================ */
const HeroSlidesEditor = () => {
  const [slides, setSlides] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  /* Confirm dialog state */
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('heroSlides', setSlides);
    return () => unsub();
  }, []);

  const openNew = () => setEditing({ ...emptySlide });
  const openEdit = (s) => setEditing({ ...s });
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.src) return toast.error('Slide source is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = { ...rest, order: Number(rest.order) || 1 };
      if (id) {
        await updateItem('heroSlides', id, payload);
        toast.success('Slide updated');
      } else {
        await createItem('heroSlides', payload);
        toast.success('Slide created');
      }
      close();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Delete (inline confirm) ---------- */
  const requestDelete = (slide) => {
    setConfirmState({
      title: 'Delete slide?',
      message: `Remove ${
        slide.title ? `"${slide.title}"` : 'this slide'
      } from the homepage carousel? This cannot be undone.`,
      confirmLabel: 'Delete slide',
      onConfirm: async () => {
        await deleteItem('heroSlides', slide.id);
        toast.success('Slide deleted');
      },
    });
  };

  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
            <p className="text-sm text-gray-500 mt-1">
              Videos and images shown in the homepage carousel.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Slide
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {slides.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No slides yet. Click "New Slide" to add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...slides]
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      {s.type === 'video' ? (
                        <video
                          src={s.src}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        s.src && (
                          <img
                            src={s.src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {s.title || '(untitled slide)'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        order {s.order}
                      </div>
                    </div>

                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 flex items-center gap-1">
                      {s.type === 'video' ? (
                        <>
                          <VideoIcon size={11} /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={11} /> Image
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => openEdit(s)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => requestDelete(s)}
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ EDIT / NEW MODAL ============ */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4 flex items-start justify-center"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? 'Edit Slide' : 'New Slide'}
                </h2>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Type toggle as segmented control */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Slide Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'image', label: 'Image', icon: ImageIcon },
                      { value: 'video', label: 'Video', icon: VideoIcon },
                    ].map(({ value, label, icon: Icon }) => {
                      const active = editing.type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setEditing((d) => ({
                              ...d,
                              type: value,
                              src: '', // clear src when switching types
                            }))
                          }
                          className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium border transition ${
                            active
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Source — image or video */}
                {editing.type === 'image' ? (
                  <ImageUploader
                    label="Slide Image"
                    value={editing.src}
                    onChange={(url) =>
                      setEditing((d) => ({ ...d, src: url }))
                    }
                  />
                ) : (
                  <>
                    <VideoUploader
                      value={editing.src}
                      onChange={(url) =>
                        setEditing((d) => ({ ...d, src: url }))
                      }
                    />
                    <ImageUploader
                      label="Poster (optional — thumbnail before playback)"
                      value={editing.poster}
                      onChange={(url) =>
                        setEditing((d) => ({ ...d, poster: url }))
                      }
                    />
                  </>
                )}

                <Field label="Title (optional)">
                  <Input value={editing.title} onChange={set('title')} />
                </Field>

                <Field label="Description (optional)">
                  <Input
                    value={editing.description}
                    onChange={set('description')}
                  />
                </Field>

                <Field label="Order" hint="Lower numbers appear first">
                  <Input
                    type="number"
                    value={editing.order}
                    onChange={set('order')}
                  />
                </Field>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={close}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving || !editing.src}
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ INLINE DELETE CONFIRM ============ */}
      <AnimatePresence>
        {confirmState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => !confirming && setConfirmState(null)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            >
              <div className="flex justify-end p-3">
                <button
                  onClick={() => setConfirmState(null)}
                  disabled={confirming}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="px-6 pb-6 -mt-2">
                <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {confirmState.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {confirmState.message}
                </p>
              </div>

              <div className="px-6 pb-6 flex justify-end gap-2">
                <button
                  onClick={() => setConfirmState(null)}
                  disabled={confirming}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={runConfirm}
                  disabled={confirming}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                >
                  {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmState.confirmLabel || 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSlidesEditor;