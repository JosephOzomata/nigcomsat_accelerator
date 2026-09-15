import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  AlertTriangle,
} from "lucide-react";
import {
  subscribeCollection,
  createItem,
  updateItem,
  deleteItem,
} from "../../services/firestore";
import { Field, Input, Textarea } from "../../components/admin/Field";
import ImageUploader from "../../components/admin/ImageUploader";

const empty = {
  slug: "",
  title: "",
  theme: "",
  year: "",
  launchDate: "",
  duration: "",
  applications: "",
  startups: "",
  tagline: "",
  description: "",
  highlights: "",
  startupsList: "",
  winners: [],
  order: 1,
};

const toForm = (d) => ({
  ...d,
  highlights: Array.isArray(d.highlights)
    ? d.highlights.join("\n")
    : d.highlights || "",
  startupsList: Array.isArray(d.startupsList)
    ? d.startupsList.join("\n")
    : d.startupsList || "",
  winners: Array.isArray(d.winners) ? d.winners : [],
});

const fromForm = (f) => {
  const { id, ...rest } = f;
  return {
    ...rest,
    highlights:
      typeof f.highlights === "string"
        ? f.highlights
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : f.highlights,
    startupsList:
      typeof f.startupsList === "string"
        ? f.startupsList
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : f.startupsList,
    order: Number(f.order) || 1,
  };
};

const emptyWinner = {
  place: 1,
  name: "",
  description: "",
  website: "",
  image: "",
};

const CohortsEditor = () => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const unsub = subscribeCollection("cohorts", setItems);
    return () => unsub();
  }, []);

  const openNew = () => setEditing({ ...empty, winners: [] });
  const openEdit = (c) => setEditing(toForm(c));
  const close = () => setEditing(null);
  const set = (k) => (e) => setEditing((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    if (!editing.title) return toast.error("Title is required");
    if (!editing.slug) return toast.error("Slug is required");
    setSaving(true);
    try {
      const payload = fromForm(editing);
      if (editing.id) await updateItem("cohorts", editing.id, payload);
      else await createItem("cohorts", payload);
      toast.success(editing.id ? "Cohort updated" : "Cohort created");
      close();
    } catch (e) {
      console.error(e);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (c) =>
    setConfirmState({
      title: "Delete cohort?",
      message: `Remove "${c.title}"? Partners and facilitators assigned to it will show as "Other".`,
      confirmLabel: "Delete",
      onConfirm: async () => {
        await deleteItem("cohorts", c.id);
        toast.success("Deleted");
      },
    });

  const runConfirm = async () => {
    if (!confirmState?.onConfirm) return;
    setConfirming(true);
    try {
      await confirmState.onConfirm();
      setConfirmState(null);
    } catch (e) {
      toast.error("Delete failed");
    } finally {
      setConfirming(false);
    }
  };

  // Winner management
  const addWinner = () =>
    setEditing((d) => ({
      ...d,
      winners: [
        ...(d.winners || []),
        { ...emptyWinner, place: (d.winners?.length || 0) + 1 },
      ],
    }));
  const updateWinner = (i, k, v) =>
    setEditing((d) => {
      const w = [...d.winners];
      w[i] = { ...w[i], [k]: v };
      return { ...d, winners: w };
    });
  const removeWinner = (i) =>
    setEditing((d) => ({
      ...d,
      winners: d.winners.filter((_, idx) => idx !== i),
    }));

  return (
    <>
      <Toaster position="top-right" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cohorts</h1>
            <p className="text-sm text-gray-500 mt-1">
              Each cohort becomes its own page at /accelerator/cohort-{"<slug>"}
            </p>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Cohort
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No cohorts yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...items]
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-600">
                      {c.year}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {c.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        /accelerator/cohort-{c.slug}
                      </div>
                    </div>
                    <button
                      onClick={() => openEdit(c)}
                      className="p-2 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => requestDelete(c)}
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
              className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">
                  {editing.id ? "Edit Cohort" : "New Cohort"}
                </h2>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Title">
                    <Input
                      value={editing.title}
                      onChange={set("title")}
                      placeholder="Cohort 1.0"
                    />
                  </Field>
                  <Field
                    label="Slug"
                    hint="URL: /accelerator/cohort-{slug}. No spaces."
                  >
                    <Input
                      value={editing.slug}
                      onChange={set("slug")}
                      placeholder="1"
                    />
                  </Field>
                  <Field label="Year">
                    <Input
                      value={editing.year}
                      onChange={set("year")}
                      placeholder="2024"
                    />
                  </Field>
                  <Field label="Launch Date">
                    <Input
                      value={editing.launchDate}
                      onChange={set("launchDate")}
                    />
                  </Field>
                  <Field label="Duration">
                    <Input
                      value={editing.duration}
                      onChange={set("duration")}
                      placeholder="24 weeks"
                    />
                  </Field>
                  <Field label="Applications">
                    <Input
                      value={editing.applications}
                      onChange={set("applications")}
                    />
                  </Field>
                  <Field label="Startups Admitted">
                    <Input
                      value={editing.startups}
                      onChange={set("startups")}
                    />
                  </Field>
                  <Field label="Order">
                    <Input
                      type="number"
                      value={editing.order}
                      onChange={set("order")}
                    />
                  </Field>
                </div>

                <Field label="Theme">
                  <Input value={editing.theme} onChange={set("theme")} />
                </Field>
                <Field label="Tagline">
                  <Input value={editing.tagline} onChange={set("tagline")} />
                </Field>
                <Field label="Description">
                  <Textarea
                    rows={3}
                    value={editing.description}
                    onChange={set("description")}
                  />
                </Field>
                <Field label="Highlights" hint="One per line">
                  <Textarea
                    rows={4}
                    value={editing.highlights}
                    onChange={set("highlights")}
                  />
                </Field>
                <Field label="Startups List" hint="One per line">
                  <Textarea
                    rows={6}
                    value={editing.startupsList}
                    onChange={set("startupsList")}
                  />
                </Field>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-900">
                      Winners
                    </label>
                    <button
                      type="button"
                      onClick={addWinner}
                      className="text-xs font-medium text-gray-700 hover:text-gray-900 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add winner
                    </button>
                  </div>
                  <div className="space-y-3">
                    {editing.winners?.map((w, i) => (
                      <div
  key={i}
  className="p-3 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
>
  <div className="flex items-center justify-between">
    <span className="text-xs font-medium text-gray-500">
      Winner {i + 1}
    </span>
    <button
      type="button"
      onClick={() => removeWinner(i)}
      className="p-1 rounded hover:bg-red-100"
    >
      <Trash2 className="w-3.5 h-3.5 text-red-500" />
    </button>
  </div>

  <ImageUploader
    label="Company Image"
    value={w.image || w.logo || ''}
    onChange={(url) => updateWinner(i, 'image', url)}
  />

  <div className="grid sm:grid-cols-4 gap-2">
    <Input
      type="number"
      value={w.place}
      onChange={(e) => updateWinner(i, 'place', Number(e.target.value))}
      placeholder="1"
    />
    <Input
      value={w.name}
      onChange={(e) => updateWinner(i, 'name', e.target.value)}
      placeholder="Company name"
      className="sm:col-span-3"
    />
  </div>

  <Textarea
    rows={2}
    value={w.description}
    onChange={(e) => updateWinner(i, 'description', e.target.value)}
    placeholder="Description"
  />

  <Input
    value={w.website}
    onChange={(e) => updateWinner(i, 'website', e.target.value)}
    placeholder="https://"
  />
</div>
                    ))}
                  </div>
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
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !confirming && setConfirmState(null)}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6"
            >
              <div className="w-11 h-11 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {confirmState.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {confirmState.message}
              </p>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setConfirmState(null)}
                  disabled={confirming}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={runConfirm}
                  disabled={confirming}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 disabled:opacity-60"
                >
                  {confirming && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmState.confirmLabel || "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CohortsEditor;
