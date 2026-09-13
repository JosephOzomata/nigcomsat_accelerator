// src/pages/admin/HackathonsEditor.jsx
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

const emptyHackathon = {
  type: 'current',
  title: '',
  tagline: '',
  description: '',
  longDescription: '',
  theme: '',
  prize: '',
  date: '',
  location: '',
  status: 'Open',
  image: '',
  tracks: '',
  skills: '',
  prizes: '',
  mentors: '',
  timeline: '',
  participants: '',
  maxParticipants: '',
  order: 1,
};

/* Convert Firestore arrays into comma-separated strings for editing */
const toForm = (doc) => ({
  ...doc,
  tracks: Array.isArray(doc.tracks) ? doc.tracks.join(', ') : doc.tracks || '',
  skills: Array.isArray(doc.skills) ? doc.skills.join(', ') : doc.skills || '',
  prizes: Array.isArray(doc.prizes) ? doc.prizes.join(', ') : doc.prizes || '',
  mentors: Array.isArray(doc.mentors) ? doc.mentors.join(', ') : doc.mentors || '',
});

/* Convert editing strings back to arrays for Firestore */
const fromForm = (form) => {
  const split = (s) =>
    typeof s === 'string'
      ? s.split(',').map((t) => t.trim()).filter(Boolean)
      : Array.isArray(s)
      ? s
      : [];

  const { id, ...rest } = form;
  return {
    ...rest,
    tracks: split(form.tracks),
    skills: split(form.skills),
    prizes: split(form.prizes),
    mentors: split(form.mentors),
    participants:
      form.participants === '' ? null : Number(form.participants),
    maxParticipants:
      form.maxParticipants === '' ? null : Number(form.maxParticipants),
    order: form.order === '' ? 1 : Number(form.order),
  };
};

const HackathonsEditor = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('hackathons', setItems);
    return () => unsub();
  }, []);

  const openNew = (type) =>
    setEditing({ ...emptyHackathon, type: type || 'current' });
  const openEdit = (h) => setEditing(toForm(h));
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const payload = fromForm(editing);
      if (editing.id) {
        await updateItem('hackathons', editing.id, payload);
        toast.success('Hackathon updated');
      } else {
        await createItem('hackathons', payload);
        toast.success('Hackathon created');
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
    if (!confirm('Delete this hackathon?')) return;
    await deleteItem('hackathons', id);
    toast.success('Hackathon deleted');
  };

  const renderRow = (h) => (
    <div
      key={h.id}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {h.image && (
          <img src={h.image} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{h.title}</div>
        <div className="text-xs text-gray-500 truncate">
          {h.date} · {h.location}
        </div>
      </div>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          h.type === 'current'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {h.type === 'current' ? 'Current' : 'Past'}
      </span>
      {h.status && (
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          {h.status}
        </span>
      )}
      <button
        onClick={() => openEdit(h)}
        className="p-2 rounded-lg hover:bg-gray-200 transition"
      >
        <Pencil className="w-4 h-4 text-gray-600" />
      </button>
      <button
        onClick={() => remove(h.id)}
        className="p-2 rounded-lg hover:bg-red-50 transition"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );

  const currentItems = items.filter((i) => i.type === 'current');
  const pastItems = items.filter((i) => i.type === 'past');

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hackathons</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage current and past hackathons.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openNew('current')}
              className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Current
            </button>
            <button
              onClick={() => openNew('past')}
              className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Past
            </button>
          </div>
        </div>

        {/* Current */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-semibold text-gray-900">
              Current Hackathons ({currentItems.length})
            </span>
          </div>
          {currentItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No current hackathons yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {currentItems.map(renderRow)}
            </div>
          )}
        </div>

        {/* Past */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-sm font-semibold text-gray-900">
              Past Hackathons ({pastItems.length})
            </span>
          </div>
          {pastItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No past hackathons yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pastItems.map(renderRow)}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
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
              className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? 'Edit Hackathon' : 'New Hackathon'}
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
                  label="Hackathon Image"
                  value={editing.image}
                  onChange={(url) =>
                    setEditing((d) => ({ ...d, image: url }))
                  }
                />

                {/* Type toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Type:
                  </span>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="current"
                      checked={editing.type === 'current'}
                      onChange={set('type')}
                      className="accent-black"
                    />
                    Current
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="past"
                      checked={editing.type === 'past'}
                      onChange={set('type')}
                      className="accent-black"
                    />
                    Past
                  </label>
                </div>

                <Field label="Title">
                  <Input value={editing.title} onChange={set('title')} />
                </Field>
                <Field label="Tagline">
                  <Input value={editing.tagline} onChange={set('tagline')} />
                </Field>
                <Field label="Short Description" hint="Shown on cards">
                  <Textarea
                    rows={2}
                    value={editing.description}
                    onChange={set('description')}
                  />
                </Field>
                <Field label="Full Description" hint="Shown in the modal">
                  <Textarea
                    rows={4}
                    value={editing.longDescription}
                    onChange={set('longDescription')}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Theme">
                    <Input value={editing.theme} onChange={set('theme')} />
                  </Field>
                  <Field label="Prize">
                    <Input value={editing.prize} onChange={set('prize')} />
                  </Field>
                  <Field label="Date">
                    <Input
                      value={editing.date}
                      onChange={set('date')}
                      placeholder="August 2026"
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={editing.location}
                      onChange={set('location')}
                    />
                  </Field>
                  <Field label="Timeline">
                    <Input
                      value={editing.timeline}
                      onChange={set('timeline')}
                      placeholder="5 Days"
                    />
                  </Field>
                  <Field label="Status" hint="Current hackathons only">
                    <select
                      value={editing.status}
                      onChange={set('status')}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="Open">Open</option>
                      <option value="Coming Soon">Coming Soon</option>
                      <option value="Apply Now">Apply Now</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Field>
                  <Field label="Participants">
                    <Input
                      type="number"
                      value={editing.participants}
                      onChange={set('participants')}
                      placeholder="0"
                    />
                  </Field>
                  <Field label="Max Participants">
                    <Input
                      type="number"
                      value={editing.maxParticipants}
                      onChange={set('maxParticipants')}
                      placeholder="0"
                    />
                  </Field>
                </div>

                <Field label="Tracks" hint="Comma-separated">
                  <Input
                    value={editing.tracks}
                    onChange={set('tracks')}
                    placeholder="Climate, Agriculture, Health"
                  />
                </Field>
                <Field label="Skills" hint="Comma-separated">
                  <Input
                    value={editing.skills}
                    onChange={set('skills')}
                    placeholder="Python, React, GIS"
                  />
                </Field>
                <Field label="Prizes" hint="Comma-separated (up to 3)">
                  <Input
                    value={editing.prizes}
                    onChange={set('prizes')}
                    placeholder="Accelerator Entry, Mentorship, Funding"
                  />
                </Field>
                <Field label="Mentors" hint="Comma-separated">
                  <Input
                    value={editing.mentors}
                    onChange={set('mentors')}
                    placeholder="Industry Experts, Technical Mentors"
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
    </>
  );
};

export default HackathonsEditor;