// src/pages/admin/AlumniEditor.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  AlertTriangle,
} from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyAlumnus = {
  name: '',
  founder: '',
  description: '',
  cohort: '',
  category: '',
  website: '',
  image: '',
  order: 1,
};

const AlumniEditor = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('alumni', setItems);
    return () => unsub();
  }, []);

  const openNew = () => setEditing({ ...emptyAlumnus });
  const openEdit = (a) => setEditing({ ...a });
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.name) return toast.error('Name is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = { ...rest, order: Number(rest.order) || 1 };
      if (id) {
        await updateItem('alumni', id, payload);
        toast.success('Alumnus updated');
      } else {
        await createItem('alumni', payload);
        toast.success('Alumnus created');
      }
      close();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (a) => {
    setConfirmState({
      title: 'Delete alumnus?',
      message: `Remove "${a.name}" from the alumni list? This cannot be undone.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        await deleteItem('alumni', a.id);
        toast.success('Alumnus deleted');
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
            <h1 className="text-2xl font-bold text-gray-900">Alumni</h1>
            <p className="text-sm text-gray-500 mt-1">
              Accelerator alumni shown on the homepage.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Alumnus
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No alumni yet. Click "New Alumnus" to add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...items]
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {a.image && (
                        <img
                          src={a.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {a.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {a.category}
                        {a.cohort ? ` · Cohort ${a.cohort}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => openEdit(a)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => requestDelete(a)}
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

      {/* Edit / New Modal */}
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
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? 'Edit Alumnus' : 'New Alumnus'}
                </h2>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <ImageUploader
                  label="Image (optional)"
                  value={editing.image}
                  onChange={(url) =>
                    setEditing((d) => ({ ...d, image: url }))
                  }
                />
                <Field label="Name">
                  <Input value={editing.name} onChange={set('name')} />
                </Field>
                <Field label="Founder (optional)">
                  <Input value={editing.founder} onChange={set('founder')} />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={editing.description}
                    onChange={set('description')}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Cohort">
                    <Input
                      value={editing.cohort}
                      onChange={set('cohort')}
                      placeholder="2024"
                    />
                  </Field>
                  <Field label="Category">
                    <Input
                      value={editing.category}
                      onChange={set('category')}
                      placeholder="Agri-Tech"
                    />
                  </Field>
                </div>
                <Field label="Website">
                  <Input value={editing.website} onChange={set('website')} />
                </Field>
                <Field label="Order" hint="Lower first">
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
                  disabled={saving}
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-60"
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

      {/* Delete Confirm Modal */}
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

export default AlumniEditor;