// src/pages/admin/PortfolioEditor.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Save } from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
  getSingleton,
  saveSingleton,
} from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyItem = {
  name: '',
  description: '',
  logo: '',
  sector: '',
  cohort: '1',
  order: 1,
};

const PortfolioEditor = () => {
  const [items, setItems] = useState([]);
  const [comingSoon, setComingSoon] = useState([]); // array of strings
  const [comingSoonInput, setComingSoonInput] = useState('');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  /* Load items + meta */
  useEffect(() => {
    const unsub = subscribeCollection('portfolio', setItems);
    return () => unsub();
  }, []);

  useEffect(() => {
    (async () => {
      const meta = await getSingleton('portfolioMeta');
      const list = meta?.comingSoonCohorts ?? [];
      setComingSoon(list);
      setComingSoonInput(list.join(', '));
    })();
  }, []);

  const saveComingSoon = async () => {
    const list = comingSoonInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await saveSingleton('portfolioMeta', { comingSoonCohorts: list });
      setComingSoon(list);
      toast.success('Coming soon cohorts saved');
    } catch (e) {
      toast.error('Save failed');
    }
  };

  const openNew = () => setEditing({ ...emptyItem });
  const openEdit = (it) => setEditing({ ...it });
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.name) return toast.error('Name is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = {
        ...rest,
        cohort: String(rest.cohort || '1'),
        order: Number(rest.order) || 1,
      };
      if (id) {
        await updateItem('portfolio', id, payload);
        toast.success('Entry updated');
      } else {
        await createItem('portfolio', payload);
        toast.success('Entry created');
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
    if (!confirm('Delete this portfolio entry?')) return;
    await deleteItem('portfolio', id);
    toast.success('Deleted');
  };

  /* Group items by cohort for list view */
  const grouped = items.reduce((acc, it) => {
    const key = String(it.cohort || '1');
    (acc[key] = acc[key] || []).push(it);
    return acc;
  }, {});

  const cohortKeys = Array.from(
    new Set([...Object.keys(grouped), ...comingSoon])
  ).sort((a, b) => Number(a) - Number(b));

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-sm text-gray-500 mt-1">
              Companies grouped by cohort. Each cohort becomes a tab.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Entry
          </button>
        </div>

        {/* Coming Soon cohorts */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
          <Field
            label="Coming Soon Cohorts"
            hint="Comma-separated cohort numbers that should display 'COMING SOON' until entries are added, e.g. 3, 4"
          >
            <div className="flex gap-2">
              <Input
                value={comingSoonInput}
                onChange={(e) => setComingSoonInput(e.target.value)}
                placeholder="3"
              />
              <button
                onClick={saveComingSoon}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 flex-shrink-0"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </Field>
        </div>

        {/* Item lists */}
        {cohortKeys.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
            No portfolio entries yet.
          </div>
        ) : (
          <div className="space-y-6">
            {cohortKeys.map((cohort) => {
              const list = grouped[cohort] || [];
              const isComingSoon = comingSoon.includes(cohort) && list.length === 0;

              return (
                <div
                  key={cohort}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      Cohort {cohort} ({list.length})
                    </span>
                    {isComingSoon && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>

                  {list.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No entries yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {list
                        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                        .map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                              {it.logo && (
                                <img
                                  src={it.logo}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {it.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {it.sector}
                              </div>
                            </div>
                            <button
                              onClick={() => openEdit(it)}
                              className="p-2 rounded-lg hover:bg-gray-200 transition"
                            >
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => remove(it.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
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
                  {editing.id ? 'Edit Entry' : 'New Entry'}
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
                  label="Company Logo"
                  value={editing.logo}
                  onChange={(url) =>
                    setEditing((d) => ({ ...d, logo: url }))
                  }
                />
                <Field label="Name">
                  <Input value={editing.name} onChange={set('name')} />
                </Field>
                <Field label="Sector">
                  <Input
                    value={editing.sector}
                    onChange={set('sector')}
                    placeholder="AgriTech / AI"
                  />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={4}
                    value={editing.description}
                    onChange={set('description')}
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Cohort" hint="e.g. 1, 2, 3">
                    <Input
                      value={editing.cohort}
                      onChange={set('cohort')}
                    />
                  </Field>
                  <Field label="Order" hint="Lower first within cohort">
                    <Input
                      type="number"
                      value={editing.order}
                      onChange={set('order')}
                    />
                  </Field>
                </div>
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

export default PortfolioEditor;