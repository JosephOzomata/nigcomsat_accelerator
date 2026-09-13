// src/pages/Portfolio.jsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  useFirestoreCollection,
  useFirestoreDoc,
} from '../hooks/useFirestore';

const Portfolio = () => {
  const { data: rawItems, loading } = useFirestoreCollection('portfolio');
  const { data: meta } = useFirestoreDoc('portfolioMeta');

  const [activeCohort, setActiveCohort] = useState(null);

  const slideVariants = {
    hidden: { x: 100, opacity: 0 },
    enter: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeIn' },
    },
  };

  /* ---------- Group items by cohort ---------- */
  const grouped = useMemo(() => {
    const sorted = [...rawItems].sort(
      (a, b) => (a.order ?? 999) - (b.order ?? 999)
    );
    const map = new Map();
    sorted.forEach((item) => {
      const key = String(item.cohort ?? '1');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }, [rawItems]);

  /* ---------- All cohorts: union of items + comingSoon ---------- */
  const cohorts = useMemo(() => {
    const fromItems = Array.from(grouped.keys());
    const fromMeta = meta?.comingSoonCohorts ?? [];
    const all = Array.from(new Set([...fromItems, ...fromMeta]));
    return all.sort((a, b) => Number(a) - Number(b));
  }, [grouped, meta]);

  /* ---------- Auto-select first cohort ---------- */
  useEffect(() => {
    if (cohorts.length > 0 && !activeCohort) {
      setActiveCohort(cohorts[0]);
    }
    if (activeCohort && !cohorts.includes(activeCohort)) {
      setActiveCohort(cohorts[0] || null);
    }
  }, [cohorts, activeCohort]);

  const isComingSoon =
    activeCohort != null &&
    (meta?.comingSoonCohorts ?? []).includes(activeCohort) &&
    !(grouped.get(activeCohort)?.length > 0);

  const activeItems = activeCohort ? grouped.get(activeCohort) ?? [] : [];

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center mt-30 mb-20">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  if (cohorts.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center mt-30 mb-20">
        <div className="m-10 text-center">
          <h1 className="text-4xl font-bold">Portfolio</h1>
          <p className="mt-4 text-gray-500 text-sm">
            No portfolio entries yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center mt-30 mb-20">
      <div className="m-10 w-full">
        <h1 className="text-4xl font-bold text-center">Portfolio</h1>

        {/* Cohort Tabs */}
        <div className="w-full flex items-center justify-center mt-8">
          <div
            className="w-[60%] grid gap-4 text-center cursor-pointer"
            style={{
              gridTemplateColumns: `repeat(${cohorts.length}, minmax(0, 1fr))`,
            }}
          >
            {cohorts.map((cohort) => (
              <p
                key={cohort}
                onClick={() => setActiveCohort(cohort)}
                className={`text-lg font-semibold border-b-2 transition-colors ${
                  activeCohort === cohort
                    ? 'border-b-black text-black'
                    : 'border-b-gray-300 text-gray-500 hover:text-black'
                }`}
              >
                Cohort {cohort}
              </p>
            ))}
          </div>
        </div>

        {/* Cohort Content */}
        <motion.div
          key={activeCohort}
          variants={slideVariants}
          initial="hidden"
          animate="enter"
          exit="exit"
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 overflow-y-auto"
          style={{ maxHeight: '600px' }}
        >
          {isComingSoon ? (
            <div className="col-span-full bg-white-200 h-[500px] flex items-center justify-center text-9xl font-extrabold">
              COMING SOON
            </div>
          ) : (
            activeItems.map((org) => (
              <div
                key={org.id}
                className="bg-gray-200 h-64 flex flex-col items-center justify-center p-4"
              >
                {org.logo && (
                  <img
                    src={org.logo}
                    alt={`${org.name} Logo`}
                    className="h-20 object-contain mb-2"
                  />
                )}
                <p className="text-sm text-center font-medium">{org.name}</p>
                {org.sector && (
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
                    {org.sector}
                  </p>
                )}
                <p className="text-xs text-center mt-1 line-clamp-3">
                  {org.description}
                </p>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;