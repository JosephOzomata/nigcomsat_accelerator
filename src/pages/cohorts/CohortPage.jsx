// src/pages/cohorts/CohortPage.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  Award,
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestore';

const placeIcon = (place) => {
  if (place === 1) return Trophy;
  if (place === 2) return Award;
  return Sparkles;
};

const placeColor = (place) => {
  if (place === 1) return 'text-yellow-500';
  if (place === 2) return 'text-gray-400';
  return 'text-amber-600';
};

const CohortPage = () => {
  const { slug } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'cohorts'),
          where('slug', '==', slug)
        );
        const snap = await getDocs(q);
        setCohort(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Cohort not found</h1>
          <p className="text-gray-500 mb-6">This cohort hasn't been published yet.</p>
          <Link
            to="/accelerator"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Accelerator
          </Link>
        </div>
      </div>
    );
  }

  const winners = (cohort.winners || []).sort((a, b) => a.place - b.place);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gray-50 border-b border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Link
              to="/accelerator"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Accelerator
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">
                {cohort.year}
              </span>
              {cohort.theme && (
                <span className="text-sm text-gray-500">{cohort.theme}</span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              {cohort.title}
            </h1>

            {cohort.description && (
              <p className="text-lg text-gray-600 max-w-2xl">{cohort.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500">
              {cohort.launchDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Launched {cohort.launchDate}
                </span>
              )}
              {cohort.duration && (
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {cohort.duration}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {(cohort.applications || cohort.startups) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm grid grid-cols-2 divide-x divide-gray-200 overflow-hidden"
          >
            {cohort.applications && (
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {cohort.applications}
                </div>
                <div className="text-sm text-gray-500 mt-1">Applications</div>
              </div>
            )}
            {cohort.startups && (
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {cohort.startups}
                </div>
                <div className="text-sm text-gray-500 mt-1">Startups Admitted</div>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* Winners */}
      {winners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Demo Day Winners</h2>
            <p className="text-sm text-gray-500 mt-1">
              Top startups from {cohort.title}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {winners.map((w, i) => {
              const Icon = placeIcon(w.place);
              return (
                <motion.div
                  key={w.place}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white border rounded-2xl p-6 ${
                    w.place === 1
                      ? 'border-yellow-200 shadow-md'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${placeColor(w.place)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {w.place === 1 ? 'Winner' : `${w.place}${w.place === 2 ? 'nd' : 'rd'} Place`}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">{w.name}</h3>
                  {w.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {w.description}
                    </p>
                  )}

                  {w.website && (
                    <a
                      href={w.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-gray-900 hover:underline"
                    >
                      Visit <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Highlights */}
      {cohort.highlights?.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Programme Highlights
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohort.highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">{h}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full startup list */}
      {cohort.startupsList?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Participating Startups</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {cohort.startupsList.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Join the next cohort
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Applications for Cohort 3.0 are open. Build your space-tech venture with us.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CohortPage;