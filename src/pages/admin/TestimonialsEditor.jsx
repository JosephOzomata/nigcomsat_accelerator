import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Save, AlertTriangle } from 'lucide-react';
import { subscribeCollection, createItem, updateItem, deleteItem } from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const empty = { name: '', role: '', company: '', quote: '', image: '', cohortSlug: '', order: 1 };

const TestimonialsEditor = () => {
  const [items, setItems] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsubItems = subscribeCollection('testimonials', setItems);
    const unsubCohorts = subscribeCollection('cohorts', (d) => setCohorts([...d].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))));
    return () => { unsubItems(); unsubCohorts(); };
  }, []);

  const openNew = () => setEditing({ ...empty });
  const openEdit = (t) => setEditing({ ...t });
  const close = () => setEditing(null);
  const set = (k) => (e) => setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.name) return toast.error('Name is required');
    if (!editing.quote) return toast.error('Quote is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = { ...rest, order: Number(rest.order) || 1 };
      if (id) await updateItem('testimonials', id, payload);
      else await createItem('testimonials', payload);
      toast.success(id ? 'Testimonial updated' : 'Testimonial created');
      close();
    } catch (e) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const requestDelete = (t) => setConfirmState({
    title: 'Delete testimonial?', message: `Remove testimonial from ${t.name}?`, confirmLabel: 'Delete',
    onConfirm: async () => { await deleteItem('testimonials', t.id); toast.success('Deleted'); },
  });

  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try { await confirmState.onConfirm(); setConfirmState(null); }
    catch { toast.error('Delete failed'); }
    finally { setConfirming(false); }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-sm text-gray-500 mt-1">Shown on /accelerator/testimonials</p>
          </div>
          <button onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Testimonial
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No testimonials yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).map((t) => (
                <div key={t.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                    {t.image && <img src={t.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{t.name}</div>
                    <div className="text-xs text-gray-500 truncate">{[t.role, t.company].filter(Boolean).join(' · ')}</div>
                  </div>
                  <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={() => requestDelete(t)} className="p-2 rounded-lg hover:bg-red-50 transition">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4 flex items-start justify-center"
            onClick={close}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">{editing.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <ImageUploader label="Photo" value={editing.image} onChange={(url) => setEditing((d) => ({ ...d, image: url }))} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name"><Input value={editing.name} onChange={set('name')} /></Field>
                  <Field label="Role"><Input value={editing.role} onChange={set('role')} placeholder="Founder" /></Field>
                  <Field label="Company"><Input value={editing.company} onChange={set('company')} /></Field>
                  <Field label="Cohort (optional)">
                    <select value={editing.cohortSlug} onChange={set('cohortSlug')}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                      <option value="">— None —</option>
                      {cohorts.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Quote"><Textarea rows={4} value={editing.quote} onChange={set('quote')} /></Field>
                <Field label="Order"><Input type="number" value={editing.order} onChange={set('order')} /></Field>
              </div>
              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button onClick={close} className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={save} disabled={saving}
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmState && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !confirming && setConfirmState(null)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
              <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{confirmState.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{confirmState.message}</p>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setConfirmState(null)} disabled={confirming}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                <button onClick={runConfirm} disabled={confirming}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-60">
                  {confirming && <Loader2 className="w-4 h-4 animate-spin" />}{confirmState.confirmLabel || 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TestimonialsEditor;