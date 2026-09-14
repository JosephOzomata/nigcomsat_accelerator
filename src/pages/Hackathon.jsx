// src/pages/Hackathon.jsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  ArrowRight,
  ChevronRight,
  Rocket,
  UserPlus,
  Share2,
  Search,
  Grid3x3,
  List,
  X,
  ArrowDown,
} from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import logo from '../images/Logo/superlogo.png';

const Hackathon = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔥 Firestore — real-time hackathons
  const { data: allHackathons, loading } = useFirestoreCollection('hackathons');

  /* ---------- Split into current & past ---------- */
  const hackathons = useMemo(
    () =>
      allHackathons
        .filter((h) => h.type === 'current')
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [allHackathons]
  );

  const pastHackathons = useMemo(
    () =>
      allHackathons
        .filter((h) => h.type === 'past')
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [allHackathons]
  );

  /* ---------- Filtering ---------- */
  const filteredHackathons = hackathons.filter((hack) => {
    const matchesStatus =
      filterStatus === 'all' || hack.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (hack.title || '').toLowerCase().includes(q) ||
      (hack.tagline || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      Open: 'bg-green-500',
      'Coming Soon': 'bg-gray-600',
      'Apply Now': 'bg-blue-600',
      Completed: 'bg-gray-500',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
          styles[status] || 'bg-gray-500'
        }`}
      >
        {status}
      </span>
    );
  };

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
              NIGCOMSAT <br />
              <span className="text-white/80">Hackathon 2026</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-xl leading-relaxed">
              Building Satellite-Enabled Early Warning & Alert Services for
              Environmental, Agricultural, and Health Intelligence Across
              Nigeria & Africa.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="/apply"
                className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-medium"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => {
            const el = document.getElementById('search');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 0.8 },
            y: { duration: 1.6, repeat: Infinity },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#8a8a8a] z-10"
          aria-label="Scroll to work"
        >
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      </section>

      {/* Search & Filters */}
      <section
        id="search"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search hackathons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['all', 'Open', 'Coming Soon', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setFilterStatus(status === 'all' ? 'all' : status)
                    }
                    className={`px-3 py-1 text-xs rounded-md transition whitespace-nowrap ${
                      filterStatus === status ||
                      (status === 'all' && filterStatus === 'all')
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <Grid3x3 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500 ml-2">
                {filteredHackathons.length} result
                {filteredHackathons.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">
              No hackathons found matching your criteria.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hack, index) => (
              <motion.div
                key={hack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => setSelectedHackathon(hack)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hack.image}
                    alt={hack.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={hack.status} />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg line-clamp-1">
                      {hack.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-1">
                      {hack.tagline}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {hack.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {hack.location}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {hack.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-gray-900 text-sm">
                        {hack.prize}
                      </span>
                    </div>
                    {hack.participants != null && hack.maxParticipants != null && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>
                          {hack.participants}/{hack.maxParticipants}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHackathons.map((hack, index) => (
              <motion.div
                key={hack.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition cursor-pointer"
                onClick={() => setSelectedHackathon(hack)}
              >
                <div className="w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={hack.image}
                    alt={hack.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={hack.status} />
                    <span className="text-xs text-gray-500">{hack.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">
                    {hack.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {hack.tagline}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3 h-3" /> {hack.location}
                  </span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" /> {hack.prize}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Past Hackathons */}
      {pastHackathons.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Past Hackathons
              </h2>
              <button className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pastHackathons.map((hack, index) => (
                <motion.div
                  key={hack.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={hack.image}
                      alt={hack.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{hack.date}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{hack.location}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {hack.title}
                    </h3>
                    {hack.theme && (
                      <p className="text-xs text-gray-500">{hack.theme}</p>
                    )}
                    {hack.participants != null && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{hack.participants}+ participants</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Participate */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Participate?
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Gain hands-on experience, network with industry leaders, and win
            opportunities that can accelerate your career.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-sm transition"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Build Real Solutions
            </h3>
            <p className="text-sm text-gray-500">
              Create prototypes that solve real-world challenges using
              satellite technology.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-sm transition"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Expert Mentorship
            </h3>
            <p className="text-sm text-gray-500">
              Learn from industry experts, technical mentors, and business
              advisors.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-sm transition"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-gray-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Accelerator Entry
            </h3>
            <p className="text-sm text-gray-500">
              Winning teams advance to the NigComSat Accelerator Programme for
              funding and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Join the NIGCOMSAT Hackathon 2026 and turn your satellite technology
            ideas into reality.
          </p>
          <a
            href="/apply"
            className="px-8 py-3.5 bg-white text-black rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Register Now
          </a>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedHackathon(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="min-h-screen flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={selectedHackathon.status} />
                    <span className="text-sm text-gray-500">
                      {selectedHackathon.date}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedHackathon(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedHackathon.title}
                    </h2>
                    <p className="text-gray-600">
                      {selectedHackathon.tagline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedHackathon.theme && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">Theme</div>
                        <div className="font-medium text-gray-900">
                          {selectedHackathon.theme}
                        </div>
                      </div>
                    )}
                    {selectedHackathon.location && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">
                          {selectedHackathon.location}
                        </div>
                      </div>
                    )}
                    {selectedHackathon.timeline && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-gray-500">Timeline</div>
                        <div className="font-medium text-gray-900">
                          {selectedHackathon.timeline}
                        </div>
                      </div>
                    )}
                    {selectedHackathon.participants != null &&
                      selectedHackathon.maxParticipants != null && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500">Participants</div>
                          <div className="font-medium text-gray-900">
                            {selectedHackathon.participants}/
                            {selectedHackathon.maxParticipants}
                          </div>
                        </div>
                      )}
                  </div>

                  {selectedHackathon.longDescription && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {selectedHackathon.longDescription}
                      </p>
                    </div>
                  )}

                  {selectedHackathon.tracks?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Tracks
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHackathon.tracks.map((track) => (
                          <span
                            key={track}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                          >
                            {track}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedHackathon.skills?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHackathon.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-black/5 text-gray-700 rounded-lg text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedHackathon.prizes?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Prizes
                      </h3>
                      <div className="flex gap-3">
                        {selectedHackathon.prizes.map((prize, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gray-50 p-3 rounded-lg text-center"
                          >
                            <div className="text-xs text-gray-500">
                              {['Winner', 'Finalist', 'Participant'][i] ||
                                `Prize ${i + 1}`}
                            </div>
                            <div className="font-medium text-gray-900 text-sm">
                              {prize}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <a
                      href="/apply"
                      className="flex-1 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition font-medium text-center"
                    >
                      Register Now
                    </a>
                    <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hackathon;