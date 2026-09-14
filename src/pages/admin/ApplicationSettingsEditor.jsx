// src/pages/admin/ApplicationSettingsEditor.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Loader2,
  Save,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { getSingleton, saveSingleton } from '../../services/firestore';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const DEFAULTS = {
  isOpen: true,
  closedTitle: 'Applications Are Currently Closed',
  closedSubtitle:
    'Thank you for your interest in the NIGCOMSAT Accelerator Programme.',
  closedMessage:
    'Applications for the current cohort have closed. Sign up for our newsletter to be notified when the next cohort opens.',
  reopenDate: '',
  closedImage: '',
  showNewsletterCta: true,
  showBackHomeCta: true,
};

const ApplicationSettingsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const doc = await getSingleton('applicationSettings');
        if (doc) setData((prev) => ({ ...prev, ...doc }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (k) => (e) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const setFlag = (k) => (val) =>
    setData((d) => ({ ...d, [k]: val }));

  const save = async () => {
    setSaving(true);
    try {
      await saveSingleton('applicationSettings', data);
      toast.success(
        data.isOpen
          ? 'Applications are now OPEN'
          : 'Applications are now CLOSED'
      );
    } catch (e) {
      console.error(e);
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings...
      </div>
    );
  }

  const isOpen = data.isOpen;

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Control whether the public application form is accepting new
            submissions.
          </p>
        </div>

        {/* Master toggle card */}
        <div
          className={`rounded-2xl border p-6 mb-6 transition ${
            isOpen
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                isOpen
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {isOpen ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900">
                Applications are currently{' '}
                <span className={isOpen ? 'text-green-700' : 'text-red-700'}>
                  {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isOpen
                  ? 'Visitors to /apply see the application form.'
                  : 'Visitors to /apply see the "Applications Closed" page.'}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, isOpen: true }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isOpen
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => setData((d) => ({ ...d, isOpen: false }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    !isOpen
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Closed
                </button>

                <a
                  href="/apply"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition"
                >
                  Preview <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Closed-page content — only editable when closed */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 mb-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200 -mx-6 px-6">
              <AlertCircle className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-900">
                Closed page content
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                What visitors see when applications are closed
              </span>
            </div>

            <ImageUploader
              label="Optional image"
              value={data.closedImage}
              onChange={(url) =>
                setData((d) => ({ ...d, closedImage: url }))
              }
            />

            <Field label="Page title">
              <Input
                value={data.closedTitle}
                onChange={set('closedTitle')}
                placeholder="Applications Are Currently Closed"
              />
            </Field>

            <Field label="Subtitle">
              <Textarea
                rows={2}
                value={data.closedSubtitle}
                onChange={set('closedSubtitle')}
                placeholder="Thank you for your interest..."
              />
            </Field>

            <Field
              label="Detailed message"
              hint="Main paragraph shown on the closed page"
            >
              <Textarea
                rows={4}
                value={data.closedMessage}
                onChange={set('closedMessage')}
              />
            </Field>

            <Field
              label="Reopen date"
              hint="Optional. e.g. Q1 2027 — leave blank to hide the reopen badge"
            >
              <Input
                value={data.reopenDate}
                onChange={set('reopenDate')}
                placeholder="Q1 2027"
              />
            </Field>

            <div className="space-y-3 pt-3 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showNewsletterCta}
                  onChange={(e) => setFlag('showNewsletterCta')(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm text-gray-700">
                  Show "Get Notified" button
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.showBackHomeCta}
                  onChange={(e) => setFlag('showBackHomeCta')(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm text-gray-700">
                  Show "Back to Home" button
                </span>
              </label>
            </div>
          </motion.div>
        )}

        {/* Save */}
        <div className="flex justify-end">
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
    </>
  );
};

export default ApplicationSettingsEditor;