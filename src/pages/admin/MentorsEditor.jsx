// src/pages/admin/MentorsEditor.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyMentor = {
  name: '',
  image: '',
  bio: '',
  cohort: 'Cohort 3',
  socialPlatform: '',
  socialUrl: '',
  order: 1,
};

const MentorsEditor = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('mentors', setItems);
    return () => unsub();
  }, []);

  const openNew = () => setEditing({ ...emptyMentor });
  const openEdit = (m) => setEditing({ ...m });
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
        await updateItem('mentors', id, payload);
        toast.success('Mentor updated');
      } else {
        await createItem('mentors', payload);
        toast.success('Mentor created');
      }
      close();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this mentor?')) return;
    await deleteItem('mentors', id);
    toast.success('Deleted');
  };

  /* Group by cohort for the list view */
  const grouped = items.reduce((acc, m) => {
    const key = m.cohort || 'Ungrouped';
    (acc[key] = acc[key] || []).push(m);
    return acc;
  }, {});

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mentors</h1>
            <p className="text-sm text-gray-500 mt-1">
              Each unique cohort becomes a tab on the homepage.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Mentor
          </button>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
            No mentors yet.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([cohort, mentors]) => (
              <div
                key={cohort}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-900">
                    {cohort} ({mentors.length})
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {mentors
                    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                    .map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {m.image && (
                            <img
                              src={m.image}
                              alt=""
                              className="w-full h-full object-cover object-top"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {m.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {m.bio}
                          </div>
                        </div>
                        <button
                          onClick={() => openEdit(m)}
                          className="p-2 rounded-lg hover:bg-gray-200 transition"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => remove(m.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  {editing.id ? 'Edit Mentor' : 'New Mentor'}
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
                  label="Mentor Photo"
                  value={editing.image}
                  onChange={(url) =>
                    setEditing((d) => ({ ...d, image: url }))
                  }
                />
                <Field label="Name">
                  <Input value={editing.name} onChange={set('name')} />
                </Field>
                <Field label="Cohort" hint="e.g. Cohort 2, Cohort 3">
                  <Input value={editing.cohort} onChange={set('cohort')} />
                </Field>
                <Field label="Bio">
                  <Textarea
                    rows={4}
                    value={editing.bio}
                    onChange={set('bio')}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Social Platform (optional)">
                    <Input
                      value={editing.socialPlatform}
                      onChange={set('socialPlatform')}
                      placeholder="LinkedIn, Instagram"
                    />
                  </Field>
                  <Field label="Social URL (optional)">
                    <Input
                      value={editing.socialUrl}
                      onChange={set('socialUrl')}
                    />
                  </Field>
                </div>
                <Field label="Order" hint="Lower first within cohort">
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
    </>
  );
};

export default MentorsEditor;