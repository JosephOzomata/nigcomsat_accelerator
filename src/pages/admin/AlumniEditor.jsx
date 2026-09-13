// src/pages/admin/LaunchpadEditor.jsx
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';
import { getSingleton, saveSingleton } from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const LaunchpadEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    eyebrow: '',
    heading: '',
    description: '',
    ctaLabel: '',
    ctaLink: '/apply',
    image: '',
  });

  useEffect(() => {
    (async () => {
      const doc = await getSingleton('launchpad');
      if (doc) setData((prev) => ({ ...prev, ...doc }));
      setLoading(false);
    })();
  }, []);

  const set = (k) => (e) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSingleton('launchpad', data);
      toast.success('Launchpad updated');
    } catch (e) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Launchpad</h1>
          <p className="text-sm text-gray-500 mt-1">
            The "Build. Launch. Scale." section on the homepage.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <ImageUploader
            label="Launchpad Image"
            value={data.image}
            onChange={(url) => setData((d) => ({ ...d, image: url }))}
          />
          <Field label="Eyebrow">
            <Input value={data.eyebrow} onChange={set('eyebrow')} />
          </Field>
          <Field label="Heading" hint="Use line breaks for multi-line headings">
            <Textarea
              rows={3}
              value={data.heading}
              onChange={set('heading')}
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={4}
              value={data.description}
              onChange={set('description')}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CTA Label">
              <Input value={data.ctaLabel} onChange={set('ctaLabel')} />
            </Field>
            <Field label="CTA Link">
              <Input value={data.ctaLink} onChange={set('ctaLink')} />
            </Field>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
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
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchpadEditor;