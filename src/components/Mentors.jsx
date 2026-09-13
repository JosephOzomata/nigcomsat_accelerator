// src/components/Mentors.jsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestoreCollection } from '../hooks/useFirestore';

const tabContentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.05, duration: 0.3 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function MentorSection() {
  const { data: rawMentors, loading } = useFirestoreCollection('mentors');
  const [activeCohort, setActiveCohort] = useState(null);

  /* Group mentors by cohort, preserving admin-defined order */
  const grouped = useMemo(() => {
    const sorted = [...rawMentors].sort(
      (a, b) => (a.order ?? 999) - (b.order ?? 999)
    );
    const map = new Map();
    sorted.forEach((m) => {
      const cohort = m.cohort || 'Mentors';
      if (!map.has(cohort)) map.set(cohort, []);
      map.get(cohort).push(m);
    });
    return map;
  }, [rawMentors]);

  const cohorts = useMemo(() => Array.from(grouped.keys()), [grouped]);

  /* Auto-select the first cohort once data loads */
  useEffect(() => {
    if (cohorts.length > 0 && !activeCohort) {
      setActiveCohort(cohorts[0]);
    }
    if (activeCohort && !cohorts.includes(activeCohort)) {
      setActiveCohort(cohorts[0] || null);
    }
  }, [cohorts, activeCohort]);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-md h-80 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (cohorts.length === 0) {
    return (
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Our Mentors
          </h2>
          <p className="mt-4 text-gray-500">No mentors published yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 font-sans min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Our Mentors
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Browse through our expert mentors across different program cohorts.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-200/80 p-1 rounded-xl flex gap-1 relative flex-wrap">
            {cohorts.map((cohort) => (
              <button
                key={cohort}
                onClick={() => setActiveCohort(cohort)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 relative z-10 ${
                  activeCohort === cohort
                    ? 'text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cohort}
                {activeCohort === cohort && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg -z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            {activeCohort && (
              <motion.div
                key={activeCohort}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {grouped.get(activeCohort).map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col"
                  >
                    <div className="w-full aspect-square overflow-hidden bg-gray-100">
                      {mentor.image && (
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover object-top"
                        />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {mentor.name}
                        </h3>
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                          {mentor.bio}
                        </p>
                      </div>

                      {mentor.socialUrl && mentor.socialPlatform && (
                        <div className="mt-6 pt-4 border-t border-gray-100 text-left">
                          <span className="text-xs text-gray-400 block font-medium uppercase tracking-wider">
                            Connect
                          </span>
                          <a
                            href={mentor.socialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-block mt-0.5 underline decoration-2 decoration-indigo-100 hover:decoration-indigo-600"
                          >
                            {mentor.socialPlatform} &rarr;
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}