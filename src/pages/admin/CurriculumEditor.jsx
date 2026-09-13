// src/pages/admin/CurriculumEditor.jsx
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
  GripVertical,
} from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';

const emptyModule = {
  title: '',
  description: '',
  topics: '',
  week: '',
  icon: 'BookOpen',
  order: 1,
};

const ICON_OPTIONS = [
  'Rocket',
  'Users',
  'Target',
  'Lightbulb',
  'TrendingUp',
  'Globe',
  'Award',
  'BookOpen',
];

const toForm = (doc) => ({
  ...doc,
  topics: Array.isArray(doc.topics) ? doc.topics.join(', ') : doc.topics || '',
});

const fromForm = (form) => {
  const { id, ...rest } = form;
  return {
    ...rest,
    topics:
      typeof form.topics === 'string'
        ? form.topics.split(',').map((t) => t.trim()).filter(Boolean)
        : form.topics,
    order: Number(form.order) || 1,
  };
};

const CurriculumEditor = () => {
  const [modules, setModules] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('curriculum', setModules);
    return () => unsub();
  }, []);

  const openNew = () =>
    setEditing({
      ...emptyModule,
      order:
        modules.reduce((max, m) => Math.max(max, m.order ?? 0), 0) + 1,
    });
  const openEdit = (m) => setEditing(toForm(m));
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = fromForm(editing);
      if (editing.id) {
        await updateItem('curriculum', editing.id, payload);
        toast.success('Module updated');
      } else {
        await createItem('curriculum', payload);
        toast.success('Module created');
      }
      close();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (m) => {
    setConfirmState({
      title: 'Delete module?',
      message: `Remove "${m.title}" from the curriculum? This cannot be undone.`,
      confirmLabel: 'Delete module',
      onConfirm: async () => {
        await deleteItem('curriculum', m.id);
        toast.success('Module deleted');
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
            <h1 className="text-2xl font-bold text-gray-900">Curriculum</h1>
            <p className="text-sm text-gray-500 mt-1">
              Modules shown on the public curriculum page. Lower order numbers
              appear first.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Module
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {modules.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No modules yet. Click "New Module" to add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...modules]
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-gray-500">
                      {m.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {m.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {m.week || '—'} · {m.topics?.length || 0} topics
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                      {m.icon}
                    </span>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => requestDelete(m)}
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
              className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? 'Edit Module' : 'New Module'}
                </h2>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <Field label="Title">
                  <Input value={editing.title} onChange={set('title')} />
                </Field>

                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={editing.description}
                    onChange={set('description')}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Week / Phase" hint="e.g. Weeks 1–6">
                    <Input
                      value={editing.week}
                      onChange={set('week')}
                      placeholder="Weeks 1–6"
                    />
                  </Field>
                  <Field label="Icon">
                    <select
                      value={editing.icon}
                      onChange={set('icon')}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Topics" hint="Comma-separated">
                  <Input
                    value={editing.topics}
                    onChange={set('topics')}
                    placeholder="Problem validation, MVP design, User testing"
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

      {/* Inline delete confirm */}
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

export default CurriculumEditor;