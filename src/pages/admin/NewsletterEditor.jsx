// src/pages/admin/NewsletterEditor.jsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  Mail,
  Trash2,
  X,
  Loader2,
  Users,
  Download,
  Send,
  Search,
  AlertTriangle,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import {
  subscribeCollection,
  deleteItem,
} from '../../services/firestore';
import { sendBulkEmail } from '../../services/email';
import { Field, Input, Textarea } from '../../components/admin/Field';
import ImageUploader from '../../components/admin/ImageUploader';

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const NewsletterEditor = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* Delete confirmation */
  const [confirmState, setConfirmState] = useState(null);
  const [confirming, setConfirming] = useState(false);

  /* Compose modal */
  const [showCompose, setShowCompose] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: '' });
  const [sendResult, setSendResult] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const unsub = subscribeCollection('subscribers', (data) => {
      const sorted = [...data].sort((a, b) => {
        const da = a.subscribedAt?.toDate?.() || new Date(a.subscribedAt || 0);
        const db_ = b.subscribedAt?.toDate?.() || new Date(b.subscribedAt || 0);
        return db_ - da;
      });
      setSubscribers(sorted);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((s) => s.email.toLowerCase().includes(q));
  }, [subscribers, search]);

  /* ---------- Delete ---------- */
  const requestDelete = (sub) => {
    setConfirmState({
      title: 'Remove subscriber?',
      message: `Remove ${sub.email} from the newsletter list?`,
      confirmLabel: 'Remove',
      onConfirm: async () => {
        await deleteItem('subscribers', sub.id);
        toast.success('Subscriber removed');
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

  /* ---------- Export CSV ---------- */
  const exportCSV = () => {
    if (subscribers.length === 0) return toast.error('No subscribers to export');
    const rows = [
      ['Email', 'Subscribed', 'Status'],
      ...subscribers.map((s) => [
        s.email,
        formatDate(s.subscribedAt),
        s.status || 'active',
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  /* ---------- Copy all emails ---------- */
  const copyAll = () => {
    if (subscribers.length === 0) return toast.error('No subscribers');
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success(`${subscribers.length} emails copied to clipboard`);
  };

  /* ---------- Send newsletter ---------- */
 const openCompose = () => {
  if (subscribers.length === 0) return toast.error('No subscribers to send to');
  setSubject('');
  setMessage('');
  setImageUrl('');
  setSendResult(null);
  setShowCompose(true);
};

const handleSend = async () => {
  if (!subject.trim()) return toast.error('Subject is required');
  if (!message.trim()) return toast.error('Message is required');

  setSending(true);
  setProgress({ done: 0, total: subscribers.length, current: '' });
  setSendResult(null);

  try {
    const result = await sendBulkEmail(
      {
        subject: subject.trim(),
        message: message.trim(),
        image_url: imageUrl || '',
      },
      subscribers,
      (done, total, email) => setProgress({ done, total, current: email })
    );

    setSendResult(result);
    if (result.failed.length === 0) toast.success(`Sent to all ${result.success} subscribers`);
    else toast.error(`Sent to ${result.success} · ${result.failed.length} failed`);
  } catch (err) {
    toast.error(err.message || 'Send failed');
  } finally {
    setSending(false);
  }
};

  const closeCompose = () => {
    if (sending) return;
    setShowCompose(false);
    setSendResult(null);
  };

  // const handleSend = async () => {
  //   if (!subject.trim()) return toast.error('Subject is required');
  //   if (!message.trim()) return toast.error('Message is required');

  //   setSending(true);
  //   setProgress({ done: 0, total: subscribers.length, current: '' });
  //   setSendResult(null);

  //   try {
  //     const result = await sendBulkEmail(
  //       { subject: subject.trim(), message: message.trim() },
  //       subscribers,
  //       (done, total, email) => setProgress({ done, total, current: email })
  //     );

  //     setSendResult(result);

  //     if (result.failed.length === 0) {
  //       toast.success(`Sent to all ${result.success} subscribers`);
  //     } else {
  //       toast.error(
  //         `Sent to ${result.success} · ${result.failed.length} failed`
  //       );
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message || 'Send failed');
  //   } finally {
  //     setSending(false);
  //   }
  // };

  /* ---------- Render ---------- */
  const progressPct =
    progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <>
      <Toaster position="top-right" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage subscribers and send updates to everyone at once.
            </p>
          </div>
          <button
            onClick={openCompose}
            disabled={subscribers.length === 0}
            className="px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send Newsletter
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" /> Total subscribers
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {subscribers.length}
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition text-left"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Download className="w-4 h-4" /> Export
            </div>
            <div className="text-base font-medium text-gray-900 mt-1">
              Download CSV
            </div>
          </button>

          <button
            onClick={copyAll}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition text-left"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Copy className="w-4 h-4" /> Bulk copy
            </div>
            <div className="text-base font-medium text-gray-900 mt-1">
              Copy all emails
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscribers..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading subscribers...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Mail className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {subscribers.length === 0
                ? 'No subscribers yet. They\u2019ll appear here when people sign up via the footer.'
                : 'No subscribers match your search.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {sub.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      Subscribed {formatDate(sub.subscribedAt)}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    {sub.status || 'active'}
                  </span>
                  <button
                    onClick={() => requestDelete(sub)}
                    className="p-2 rounded-lg hover:bg-red-50 transition"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============ COMPOSE NEWSLETTER MODAL ============ */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-4 flex items-start justify-center"
            onClick={closeCompose}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <div>
                  <h2 className="font-bold text-gray-900">Send Newsletter</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Will be sent to{' '}
                    <span className="font-medium text-gray-700">
                      {subscribers.length} subscriber
                      {subscribers.length !== 1 ? 's' : ''}
                    </span>
                  </p>
                </div>
                <button
                  onClick={closeCompose}
                  disabled={sending}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <ImageUploader
  label="Header image (optional)"
  value={imageUrl}
  onChange={setImageUrl}
/>

<Field label="Subject">
  <Input
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    placeholder="NIGCOMSAT Accelerator — March Update"
    disabled={sending}
  />
</Field>
                <Field label="Subject">
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="NIGCOMSAT Accelerator — March Update"
                    disabled={sending}
                  />
                </Field>

                <Field
                  label="Message"
                  hint="Plain text. Line breaks will be preserved."
                >
                  <Textarea
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Hello,\n\nHere's what's new at the NIGCOMSAT Accelerator this month...\n\nBest regards,\nThe NIGCOMSAT Team`}
                    disabled={sending}
                  />
                </Field>

                {/* Progress */}
                {sending && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-700 font-medium flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </span>
                      <span className="text-gray-500">
                        {progress.done} / {progress.total}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    {progress.current && (
                      <p className="text-xs text-gray-500 mt-2 truncate">
                        → {progress.current}
                      </p>
                    )}
                  </div>
                )}

                {/* Result */}
                {sendResult && !sending && (
                  <div
                    className={`p-4 rounded-lg border ${
                      sendResult.failed.length === 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {sendResult.failed.length === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {sendResult.success} sent
                          {sendResult.failed.length > 0
                            ? ` · ${sendResult.failed.length} failed`
                            : ''}
                        </p>
                        {sendResult.failed.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-600 cursor-pointer">
                              Show failed emails
                            </summary>
                            <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
                              {sendResult.failed.map((f) => (
                                <li key={f.email} className="truncate">
                                  {f.email} — {f.error}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* EmailJS quota warning */}
                <p className="text-xs text-gray-400">
                  Note: EmailJS free tier allows 200 emails/month. Each
                  subscriber counts as one email.
                </p>
              </div>

              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={closeCompose}
                  disabled={sending}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {sendResult ? 'Close' : 'Cancel'}
                </button>
                <button
                  onClick={handleSend}
                  disabled={
                    sending ||
                    !subject.trim() ||
                    !message.trim() ||
                    !!sendResult
                  }
                  className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send to {subscribers.length}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRM ============ */}
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
                  {confirmState.confirmLabel || 'Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterEditor;