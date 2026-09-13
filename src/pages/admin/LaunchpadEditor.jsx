// src/pages/admin/LaunchpadEditor.jsx
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { getSingleton, saveSingleton } from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

/* Default content mirrors the current hardcoded Launchpad section
   so the admin never sees blank fields. */
const DEFAULT_DATA = {
  eyebrow: 'NIGCOMSAT Accelerator',
  heading: 'Build.\nLaunch.\nScale.',
  description:
    "More than an accelerator—we're a launchpad for ambitious founders, providing the mentorship, partnerships, and national infrastructure needed to transform bold ideas into lasting impact.",
  ctaLabel: 'Join the Accelerator',
  ctaLink: '/apply',
  image: '',
};

const LaunchpadEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);

  useEffect(() => {
    (async () => {
      try {
        const doc = await getSingleton('launchpad');
        if (doc) {
          // Merge Firestore data over defaults (so new fields are auto-added)
          setData((prev) => ({ ...prev, ...doc }));
          setIsNew(false);
        } else {
          // No doc yet — show defaults so admin can just hit Save
          setIsNew(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (k) => (e) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSingleton('launchpad', data);
      toast.success(isNew ? 'Launchpad published' : 'Launchpad updated');
      setIsNew(false);
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (!window.confirm('Reset all fields to the default content?')) return;
    setData(DEFAULT_DATA);
    toast.success('Reset to defaults — click Save to publish');
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Launchpad</h1>
            <p className="text-sm text-gray-500 mt-1">
              The "Build. Launch. Scale." section on the homepage.
            </p>
          </div>

          {isNew && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              Not published yet — click Save to make it appear on the site
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <ImageUploader
            label="Launchpad Image"
            value={data.image}
            onChange={(url) => setData((d) => ({ ...d, image: url }))}
          />

          <Field label="Eyebrow" hint="Small uppercase text above the heading">
            <Input
              value={data.eyebrow}
              onChange={set('eyebrow')}
              placeholder="NIGCOMSAT Accelerator"
            />
          </Field>

          <Field
            label="Heading"
            hint="Each line break becomes a new line on the site"
          >
            <Textarea
              rows={3}
              value={data.heading}
              onChange={set('heading')}
              placeholder={'Build.\nLaunch.\nScale.'}
            />
          </Field>

          <Field label="Description">
            <Textarea
              rows={4}
              value={data.description}
              onChange={set('description')}
              placeholder="Describe the accelerator in a paragraph..."
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA Label">
              <Input
                value={data.ctaLabel}
                onChange={set('ctaLabel')}
                placeholder="Join the Accelerator"
              />
            </Field>
            <Field label="CTA Link">
              <Input
                value={data.ctaLink}
                onChange={set('ctaLink')}
                placeholder="/apply"
              />
            </Field>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to defaults
            </button>

            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving
                ? 'Saving...'
                : isNew
                  ? 'Publish Launchpad'
                  : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchpadEditor;