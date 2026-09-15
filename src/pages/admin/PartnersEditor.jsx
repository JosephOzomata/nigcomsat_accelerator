import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Save, AlertTriangle } from 'lucide-react';
import { subscribeCollection, createItem, updateItem, deleteItem } from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const empty = {
  cohortSlug: '',
  name: '',
  role: '',
  logo: '',
  description: '',
  website: '',
  socials: { twitter: '', linkedin: '', instagram: '' },
  order: 1,
};

const PartnersEditor = () => {
  const [items, setItems] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsubItems = subscribeCollection('partners', setItems);
    const unsubCohorts = subscribeCollection('cohorts', (d) =>
      setCohorts([...d].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)))
    );
    return () => { unsubItems(); unsubCohorts(); };
  }, []);

  const openNew = () => setEditing({ ...empty, socials: { twitter: '', linkedin: '', instagram: '' } });
  const openEdit = (p) => setEditing({ ...p, socials: { twitter: '', linkedin: '', instagram: '', ...(p.socials || {}) } });
  const close = () => setEditing(null);
  const set = (k) => (e) => setEditing((d) => ({ ...d, [k]: e.target.value }));
  const setSocial = (k) => (e) =>
    setEditing((d) => ({ ...d, socials: { ...(d.socials || {}), [k]: e.target.value } }));

  const save = async () => {
    if (!editing.name) return toast.error('Name is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = { ...rest, order: Number(rest.order) || 1 };
      if (id) await updateItem('partners', id, payload);
      else await createItem('partners', payload);
      toast.success(id ? 'Partner updated' : 'Partner created');
      close();
    } catch (e) {
      console.error(e); toast.error('Save failed');
    } finally { setSaving(false); }
  };

  const requestDelete = (p) => setConfirmState({
    title: 'Delete partner?',
    message: `Remove "${p.name}"?`,
    confirmLabel: 'Delete',
    onConfirm: async () => { await deleteItem('partners', p.id); toast.success('Deleted'); },
  });

  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try { await confirmState.onConfirm(); setConfirmState(null); }
    catch (e) { toast.error('Delete failed'); }
    finally { setConfirming(false); }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
            <p className="text-sm text-gray-500 mt-1">Assigned to a cohort. Shown on /partners and cohort pages.</p>
          </div>
          <button onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Partner
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No partners yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {p.logo && <img src={p.logo} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {cohorts.find((c) => c.slug === p.cohortSlug)?.title || 'No cohort'}
                    </div>
                  </div>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-200 transition">
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button onClick={() => requestDelete(p)} className="p-2 rounded-lg hover:bg-red-50 transition">
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
                <h2 className="font-bold text-gray-900">{editing.id ? 'Edit Partner' : 'New Partner'}</h2>
                <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <ImageUploader label="Logo" value={editing.logo} onChange={(url) => setEditing((d) => ({ ...d, logo: url }))} />

                <Field label="Cohort">
                  <select value={editing.cohortSlug} onChange={set('cohortSlug')}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="">— Select cohort —</option>
                    {cohorts.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
                  </select>
                </Field>

                <Field label="Name"><Input value={editing.name} onChange={set('name')} /></Field>
                <Field label="Description"><Textarea rows={3} value={editing.description} onChange={set('description')} /></Field>
                <Field label="Website"><Input value={editing.website} onChange={set('website')} placeholder="https://" /></Field>

                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="Twitter"><Input value={editing.socials?.twitter || ''} onChange={setSocial('twitter')} /></Field>
                  <Field label="LinkedIn"><Input value={editing.socials?.linkedin || ''} onChange={setSocial('linkedin')} /></Field>
                  <Field label="Instagram"><Input value={editing.socials?.instagram || ''} onChange={setSocial('instagram')} /></Field>
                </div>

                <Field label="Order" hint="Lower first"><Input type="number" value={editing.order} onChange={set('order')} /></Field>
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
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }} onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
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

export default PartnersEditor;