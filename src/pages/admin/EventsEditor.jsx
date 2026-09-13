// src/pages/admin/EventsEditor.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Loader2, Save, Star, AlertTriangle } from 'lucide-react';
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyEvent = {
  title: '',
  description: '',
  date: '',
  dateISO: '',
  location: '',
  category: '',
  image: '',
  status: 'Upcoming',
  featured: false,
  attendees: '',
  order: 1,
};

const EventsEditor = () => {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // ← event to delete
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection('events', setEvents);
    return () => unsub();
  }, []);

  const openNew = () => setEditing({ ...emptyEvent });
  const openEdit = (ev) => setEditing({ ...ev });
  const close = () => setEditing(null);
  const set = (k) => (e) =>
    setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.title) return toast.error('Title is required');
    setSaving(true);
    try {
      const { id, ...rest } = editing;
      const payload = {
        ...rest,
        attendees: rest.attendees === '' ? null : Number(rest.attendees),
        order: rest.order === '' ? 1 : Number(rest.order),
        featured: Boolean(rest.featured),
      };

      if (payload.featured) {
        await Promise.all(
          events
            .filter((e) => e.featured && e.id !== id)
            .map((e) => updateItem('events', e.id, { featured: false }))
        );
      }

      if (id) {
        await updateItem('events', id, payload);
        toast.success('Event updated');
      } else {
        await createItem('events', payload);
        toast.success('Event created');
      }
      close();
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  /* Open confirm dialog */
  const requestDelete = (ev) => {
    console.log('requestDelete called with:', ev); // ← debug
    setDeleteTarget(ev);
  };

  /* Perform delete */
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteItem('events', deleteTarget.id);
      toast.success('Event deleted');
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage upcoming and past events.
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Event
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {events.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No events yet. Click "New Event" to add one.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {ev.image && (
                      <img
                        src={ev.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {ev.title}
                      </span>
                      {ev.featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {ev.date} · {ev.location}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {ev.status}
                  </span>
                  <button
                    onClick={() => openEdit(ev)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => requestDelete(ev)}
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

      {/* Edit/New Modal */}
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
              className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? 'Edit Event' : 'New Event'}
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
                  label="Event Image"
                  value={editing.image}
                  onChange={(url) =>
                    setEditing((d) => ({ ...d, image: url }))
                  }
                />

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
                  <Field
                    label="Display Date"
                    hint="Shown on cards, e.g. August 6-13, 2026"
                  >
                    <Input
                      value={editing.date}
                      onChange={set('date')}
                      placeholder="August 6-13, 2026"
                    />
                  </Field>
                  <Field
                    label="Calendar Date (ISO)"
                    hint="Used by calendar, e.g. 2026-08-06"
                  >
                    <Input
                      type="date"
                      value={editing.dateISO}
                      onChange={set('dateISO')}
                    />
                  </Field>
                  <Field label="Location">
                    <Input
                      value={editing.location}
                      onChange={set('location')}
                    />
                  </Field>
                  <Field label="Category">
                    <Input
                      value={editing.category}
                      onChange={set('category')}
                      placeholder="Hackathon, Workshop, etc."
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={editing.status}
                      onChange={set('status')}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Field>
                  <Field label="Attendees" hint="Optional (for past events)">
                    <Input
                      type="number"
                      value={editing.attendees}
                      onChange={set('attendees')}
                      placeholder="0"
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={Boolean(editing.featured)}
                    onChange={(e) =>
                      setEditing((d) => ({
                        ...d,
                        featured: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-black"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Mark as <strong>Featured Event</strong> (only one at a
                    time)
                  </label>
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

      {/* ============ INLINE DELETE CONFIRM ============ */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => !deleting && setDeleteTarget(null)}
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
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
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
                  Delete event?
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Are you sure you want to delete "{deleteTarget.title}"? This
                  cannot be undone.
                </p>
              </div>

              <div className="px-6 pb-6 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                >
                  {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventsEditor;