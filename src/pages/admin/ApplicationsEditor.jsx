// src/pages/admin/ApplicationsEditor.jsx
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  Mail,
  Phone,
  Video,
  Download,
  Trash2,
  X,
  User,
  Users,
  CheckCircle2,
  Circle,
  Clock,
  Search,
  Filter,
  Eye,
  ExternalLink,
  MessageSquare,
  Building2,
  Calendar,
  Loader2,
} from "lucide-react";
import {
  subscribeCollection,
  updateItem,
  deleteItem,
} from "../../services/firestore";

/* ---------- Status helpers ---------- */
const STATUS = {
  new: {
    label: "New",
    color: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    icon: Circle,
  },
  viewed: {
    label: "Viewed",
    color: "bg-yellow-500",
    text: "text-yellow-700",
    bg: "bg-yellow-50",
    icon: Eye,
  },
  contacted: {
    label: "Contacted",
    color: "bg-green-500",
    text: "text-green-700",
    bg: "bg-green-50",
    icon: CheckCircle2,
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
      {s.label}
    </span>
  );
};

/* ---------- Format helper ---------- */
const formatDate = (timestamp) => {
  if (!timestamp) return "—";
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ---------- Email body generator ---------- */
const buildEmailBody = (app) => {
  const name = `${app.firstName || ""} ${app.lastName || ""}`.trim() || "there";
  return `Hello ${name},

Thank you for applying to the NIGCOMSAT Accelerator Programme (Cohort 3.0). We've received your application for ${app.teamName || "your team"} and our team is currently reviewing it.

We were impressed by what we saw and would like to take the next step in the process. Please reply to this email so we can schedule a short introductory call.

Looking forward to speaking with you.

Best regards,
NIGCOMSAT Accelerator Team`;
};

/* ============================================================
   Applications Editor
   ============================================================ */
const ApplicationsEditor = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    const unsub = subscribeCollection("applications", (data) => {
      const sorted = [...data].sort((a, b) => {
        const da = a.submittedAt?.toDate?.() || new Date(a.submittedAt || 0);
        const db_ = b.submittedAt?.toDate?.() || new Date(b.submittedAt || 0);
        return db_ - da;
      });
      setApplications(sorted);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const status = app.status || "new";
      const matchesFilter = filter === "all" || status === filter;
      const q = search.trim().toLowerCase();
      const haystack =
        `${app.firstName} ${app.lastName} ${app.teamName} ${app.email}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, search]);

  /* ---------- Mark status ---------- */
  const setStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateItem("applications", id, { status });
      if (selected?.id === id) {
        setSelected((prev) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------- Open modal (auto-mark as viewed) ---------- */
  const openModal = async (app) => {
    setSelected(app);
    if ((app.status || "new") === "new") {
      await setStatus(app.id, "viewed");
    }
  };

  /* ---------- Delete ---------- */
  /* ---------- Delete (opens confirm modal) ---------- */
const requestDelete = (id) => {
  const app = applications.find((a) => a.id === id);
  const name = app
    ? `${app.firstName || ''} ${app.lastName || ''}`.trim()
    : 'this application';

  setConfirm({
    title: 'Delete application?',
    message: `Are you sure you want to delete the application from ${name}? This cannot be undone.`,
    confirmLabel: 'Delete',
    variant: 'danger',
    onConfirm: async () => {
      try {
        await deleteItem('applications', id);
        toast.success('Application deleted');
        if (selected?.id === id) setSelected(null);
      } catch (e) {
        console.error(e);
        toast.error('Delete failed');
      }
    },
  });
};

  /* ---------- Video download ---------- */
  const handleDownload = async (url, filename) => {
    try {
      toast.loading("Preparing download...", { id: "dl" });
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename || "pitch-video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success("Download started", { id: "dl" });
    } catch (e) {
      console.error(e);
      toast.error("Download failed", { id: "dl" });
    }
  };

  /* ---------- Email ---------- */
  const sendEmail = (app, markContacted = true) => {
    const subject = `NIGCOMSAT Accelerator – Application Update for ${app.teamName || "your team"}`;
    const body = buildEmailBody(app);
    const mailto = `mailto:${app.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    if (markContacted) {
      setTimeout(() => setStatus(app.id, "contacted"), 500);
    }
  };

  /* ---------- Status counts ---------- */
  const counts = useMemo(() => {
    const c = { all: applications.length, new: 0, viewed: 0, contacted: 0 };
    applications.forEach((a) => {
      const s = a.status || "new";
      if (c[s] !== undefined) c[s]++;
    });
    return c;
  }, [applications]);

  return (
    <>
      <Toaster position="top-right" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review, contact, and manage accelerator applicants.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, team, or email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "All", count: counts.all },
              { key: "new", label: "New", count: counts.new },
              { key: "viewed", label: "Viewed", count: counts.viewed },
              { key: "contacted", label: "Contacted", count: counts.contacted },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1.5 whitespace-nowrap ${
                  filter === tab.key
                    ? "bg-white shadow-sm text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 rounded-full ${
                    filter === tab.key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {applications.length === 0
                ? "No applications received yet."
                : "No applications match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ backgroundColor: "rgb(249 250 251)" }}
                  onClick={() => openModal(app)}
                  className="p-4 flex items-center gap-4 cursor-pointer transition"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-gray-700">
                      {(app.firstName?.[0] || "") + (app.lastName?.[0] || "")}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900 truncate">
                        {app.firstName} {app.lastName}
                      </span>
                      <StatusBadge status={app.status || "new"} />
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {app.teamName} · {app.email}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(app.submittedAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => sendEmail(app, false)}
                      title="Send email"
                      className="p-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Mail className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => requestDelete(app.id)}
                      title="Delete"
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="min-h-screen flex items-start justify-center p-4 py-8"
            >
              <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white z-10 p-5 border-b border-gray-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusBadge status={selected.status || "new"} />
                    <span className="text-sm text-gray-500 truncate">
                      Applied {formatDate(selected.submittedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {updatingId === selected.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    )}
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto">
                  {/* Applicant */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selected.firstName} {selected.lastName}
                    </h2>
                    {selected.otherNames && (
                      <p className="text-sm text-gray-500">
                        Other names: {selected.otherNames}
                      </p>
                    )}
                    <p className="text-gray-600 mt-1 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {selected.teamName}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent(
                        `NIGCOMSAT Accelerator – Application Update for ${selected.teamName || "your team"}`,
                      )}&body=${encodeURIComponent(buildEmailBody(selected))}`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {selected.email}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-600" />
                    </a>

                    <a
                      href={`tel:${selected.phone}`}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {selected.phone}
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Team & eligibility */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Eligibility & Team
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "CAC", value: selected.cacRegistered },
                        { label: "Digital", value: selected.digitalPresence },
                        { label: "MVP", value: selected.hasMvp },
                        { label: "Team 2+", value: selected.teamSize },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-3 rounded-lg border text-center ${
                            item.value === "Yes"
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="text-xs text-gray-500">
                            {item.label}
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              item.value === "Yes"
                                ? "text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Pitch Video
                      </h3>
                      {selected.videoUrl && (
                        <button
                          onClick={() =>
                            handleDownload(
                              selected.videoUrl,
                              `${selected.teamName || "pitch"}-video.mp4`,
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      )}
                    </div>

                    {selected.videoUrl ? (
                      <div className="rounded-xl overflow-hidden bg-black border border-gray-200">
                        <video
                          key={selected.videoUrl}
                          src={selected.videoUrl}
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                          playsInline
                          crossOrigin="anonymous"
                          className="w-full max-h-96 object-contain bg-black"
                          onError={(e) => {
                            console.error("Video failed to load:", {
                              url: selected.videoUrl,
                              error: e?.target?.error,
                            });
                            toast.error(
                              "Video could not be loaded. It may have been uploaded with the wrong resource type.",
                            );
                          }}
                        >
                          Your browser cannot play this video.
                        </video>
                      </div>
                    ) : (
                      <div className="p-6 border border-dashed border-gray-300 rounded-xl text-center text-sm text-gray-500">
                        {selected.videoName
                          ? `Uploaded: ${selected.videoName} — video URL missing (upload before the fix)`
                          : "No video uploaded"}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => sendEmail(selected)}
                        disabled={selected.status === "contacted"}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Mail className="w-4 h-4" />
                        {selected.status === "contacted"
                          ? "Already Contacted"
                          : "Send Email to Applicant"}
                      </button>

                      {selected.status !== "contacted" && (
                        <button
                          onClick={() => setStatus(selected.id, "contacted")}
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark as Contacted
                        </button>
                      )}

                      <button
                        onClick={() => requestDelete(selected.id)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    <p className="text-xs text-gray-400">
                      Clicking "Send Email" opens your default mail app with the
                      applicant's address pre-filled and marks them as
                      contacted.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
    </>
  );
};

export default ApplicationsEditor;
