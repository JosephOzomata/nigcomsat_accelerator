// src/pages/admin/GalleryEditor.jsx
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Trash2,
  X,
  Loader2,
  FolderPlus,
  Images,
  Video,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  deleteItem,
} from '../../services/firestore';
import { uploadImage } from '../../services/cloudinary';
import UploadArea from '../../components/upload/UploadArea';
import PreviewCard from '../../components/upload/PreviewCard';
import UploadButton from '../../components/upload/UploadButton';
import ProgressBar from '../../components/upload/ProgressBar';
import { Field, Input } from '../../components/admin/Field';

const GalleryEditor = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Upload state */
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /* Category creation */
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  /* Confirm dialog */
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  /* ---------- Subscriptions ---------- */
  useEffect(() => {
    const unsubCats = subscribeCollection('galleryCategories', (data) => {
      const sorted = [...data].sort(
        (a, b) => (a.order ?? 999) - (b.order ?? 999)
      );
      setCategories(sorted);

      setSelectedCategory((prev) => {
        if (prev && sorted.some((c) => c.id === prev.id)) return prev;
        return sorted[0] || null;
      });

      setLoading(false);
    });
    return () => unsubCats();
  }, []);

  useEffect(() => {
    const unsubItems = subscribeCollection('gallery', setItems);
    return () => unsubItems();
  }, []);

  /* ---------- Derived ---------- */
  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return items
      .filter((it) => it.category === selectedCategory.name)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }, [items, selectedCategory]);

  const itemCounts = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      map[it.category] = (map[it.category] || 0) + 1;
    });
    return map;
  }, [items]);

  /* ---------- Confirm runner ---------- */
  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (e) {
      console.error(e);
      toast.error('Action failed');
    } finally {
      setConfirming(false);
    }
  };

  /* ---------- Category CRUD ---------- */
  const createCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return toast.error('Category name is required');
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return toast.error('That category already exists');
    }

    setCreatingCategory(true);
    try {
      const nextOrder =
        categories.reduce((max, c) => Math.max(max, c.order ?? 0), 0) + 1;

      const docRef = await createItem('galleryCategories', {
        name,
        order: nextOrder,
      });

      setSelectedCategory({ id: docRef.id, name, order: nextOrder });
      setNewCategoryName('');
      setShowNewCategory(false);
      toast.success(`Category "${name}" created`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const requestDeleteCategory = (cat) => {
    const count = itemCounts[cat.name] || 0;
    const message = count
      ? `Delete "${cat.name}" and its ${count} item${count > 1 ? 's' : ''}? This cannot be undone.`
      : `Delete category "${cat.name}"?`;

    setConfirmState({
      title: 'Delete category?',
      message,
      confirmLabel: 'Delete category',
      onConfirm: async () => {
        const toDelete = items.filter((it) => it.category === cat.name);
        await Promise.all(toDelete.map((it) => deleteItem('gallery', it.id)));
        await deleteItem('galleryCategories', cat.id);
        toast.success(`Deleted "${cat.name}"`);
      },
    });
  };

  /* ---------- Item CRUD ---------- */
  const requestDeleteItem = (item) => {
    setConfirmState({
      title: 'Remove item?',
      message: `Remove "${item.filename || 'this item'}" from the gallery? This cannot be undone.`,
      confirmLabel: 'Remove',
      onConfirm: async () => {
        await deleteItem('gallery', item.id);
        toast.success('Item removed');
      },
    });
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  /* ---------- Upload ---------- */
  const uploadAll = async () => {
    if (!selectedCategory) {
      return toast.error('Please select or create a category first');
    }
    if (!files.length) {
      return toast.error('Please select files to upload');
    }

    setUploading(true);
    setProgress(0);

    try {
      let uploaded = 0;
      const baseOrder =
        categoryItems.reduce((max, it) => Math.max(max, it.order ?? 0), 0) + 1;

      for (let i = 0; i < files.length; i++) {
        const { file, isVideo } = files[i];

        const result = await uploadImage(file, isVideo ? 'video' : 'image');

        await createItem('gallery', {
          category: selectedCategory.name,
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? 'video' : 'image',
          filename: file.name,
          size: file.size,
          order: baseOrder + i,
        });

        uploaded++;
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      toast.success(
        `${uploaded} file${uploaded > 1 ? 's' : ''} uploaded to "${selectedCategory.name}"`
      );

      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setProgress(0);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /* ---------- Render ---------- */
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading gallery...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ============ CATEGORIES SIDEBAR ============ */}
        <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden h-fit lg:sticky lg:top-24">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">
                Categories
              </span>
            </div>
            <button
              onClick={() => setShowNewCategory(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
              title="New category"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {categories.length === 0 ? (
              <div className="p-4 text-center">
                <FolderPlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-3">
                  No categories yet
                </p>
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="text-xs font-medium text-gray-900 hover:underline"
                >
                  Create your first one
                </button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {categories.map((cat) => {
                  const isActive = selectedCategory?.id === cat.id;
                  const count = itemCounts[cat.name] || 0;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer transition ${
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">
                          {cat.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isActive ? 'text-white/60' : 'text-gray-400'
                          }`}
                        >
                          {count} item{count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDeleteCategory(cat);
                        }}
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${
                          isActive
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-gray-200 text-gray-500'
                        }`}
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ============ MAIN PANEL ============ */}
        <div className="min-w-0">
          {!selectedCategory ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <FolderPlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                No category selected
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Create a category to start uploading images and videos.
              </p>
              <button
                onClick={() => setShowNewCategory(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                <Plus className="w-4 h-4" />
                New Category
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedCategory.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {categoryItems.length} item
                    {categoryItems.length !== 1 ? 's' : ''} · upload images and
                    videos below
                  </p>
                </div>
              </div>

              {/* Upload */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <UploadArea
                  files={files}
                  setFiles={setFiles}
                  disabled={uploading}
                />

                {files.length > 0 && (
                  <motion.div
                    layout
                    className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                  >
                    {files.map((file) => (
                      <PreviewCard
                        key={file.id}
                        image={file}
                        remove={removeFile}
                      />
                    ))}
                  </motion.div>
                )}

                {uploading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium">
                        Uploading...
                      </span>
                      <span className="text-gray-500">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                )}

                {files.length > 0 && !uploading && (
                  <div className="mt-6">
                    <UploadButton
                      onClick={uploadAll}
                      disabled={uploading || !files.length}
                      loading={uploading}
                      count={files.length}
                    />
                  </div>
                )}
              </div>

              {/* Existing items */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Items in this category
                </h2>

                {categoryItems.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">
                      No items yet. Upload some above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div className="relative aspect-square bg-black">
                          {item.type === 'video' ? (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                              controls
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.filename || ''}
                              className="w-full h-full object-cover"
                            />
                          )}

                          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-[10px]">
                            {item.type === 'video' ? (
                              <>
                                <Video size={10} /> Video
                              </>
                            ) : (
                              'Image'
                            )}
                          </div>

                          <button
                            onClick={() => requestDeleteItem(item)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="p-3">
                          <p className="text-xs text-gray-500 truncate">
                            {item.filename || '—'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ NEW CATEGORY MODAL ============ */}
      <AnimatePresence>
        {showNewCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => !creatingCategory && setShowNewCategory(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">New Category</h2>
                <button
                  onClick={() => setShowNewCategory(false)}
                  disabled={creatingCategory}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <Field
                  label="Category name"
                  hint="This will be the section title on the public gallery page."
                >
                  <Input
                    autoFocus
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') createCategory();
                    }}
                    placeholder="e.g. Cohort 3 Demo Day"
                  />
                </Field>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowNewCategory(false)}
                  disabled={creatingCategory}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createCategory}
                  disabled={creatingCategory || !newCategoryName.trim()}
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
                >
                  {creatingCategory ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Create
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

export default GalleryEditor;