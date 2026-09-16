import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Trophy, Award, Sparkles, ArrowLeft, ExternalLink,
  Building2, Users,
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import PersonCard from '../../components/PersonCard';
import logo from '../../images/Logo/superlogo.png';

const placeIcon = (p) => p === 1 ? Trophy : p === 2 ? Award : Sparkles;

const CohortPage = () => {
  const { slug } = useParams();
  const [cohort, setCohort] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: allPartners } = useFirestoreCollection('partners');
  const { data: allFacilitators } = useFirestoreCollection('facilitators');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'cohorts'), where('slug', '==', slug));
        const snap = await getDocs(q);
        setCohort(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Cohort not found</h1>
          <Link to="/accelerator" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Accelerator
          </Link>
        </div>
      </div>
    );
  }

  const cohortSlug = cohort.slug;
  const partners = allPartners.filter((p) => p.cohortSlug === cohortSlug).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const facilitators = allFacilitators.filter((f) => f.cohortSlug === cohortSlug).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const winners = (cohort.winners || []).slice().sort((a, b) => a.place - b.place);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              {/* <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">{cohort.year}</span> */}
              {/* {cohort.theme && <span className="text-sm text-gray-500">{cohort.theme}</span>} */}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">{cohort.title}: {cohort.theme}</h1>
            {cohort.tagline && <p className="text-lg text-gray-600 max-w-2xl mb-4">{cohort.tagline}</p>}
            {cohort.description && <p className="text-base text-gray-600 max-w-2xl leading-relaxed">{cohort.description}</p>}
            <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-500">
              {cohort.launchDate && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Launched {cohort.launchDate}</span>}
              {cohort.duration && <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {cohort.duration}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {(cohort.applications || cohort.startups) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm grid grid-cols-2 divide-x divide-gray-200 overflow-hidden">
            {cohort.applications && <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{cohort.applications}</div>
              <div className="text-sm text-gray-500 mt-1">Applications</div>
            </div>}
            {cohort.startups && <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{cohort.startups}</div>
              <div className="text-sm text-gray-500 mt-1">Startups Admitted</div>
            </div>}
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
      {winners.map((w, i) => (
        <motion.div
          key={w.place}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow flex flex-col"
        >
          {/* Hero image — bleeds to card edges */}
          <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
            {(w.image || w.logo) ? (
              <img
                src={w.image || w.logo}
                alt={w.name}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-bold">
                {w.name?.[0] || '?'}
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="relative p-6 flex-1 flex flex-col overflow-hidden">
            {/* Big dim watermark number */}
            <span
              aria-hidden="true"
              className="absolute -bottom-8 -right-2 text-[200px] leading-none font-bold text-gray-100 select-none pointer-events-none tabular-nums"
            >
              {w.place}
            </span>

            <div className="relative flex flex-col h-full">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
                {w.place === 1
                  ? 'Winner'
                  : w.place === 2
                    ? '2nd Place'
                    : `${w.place}rd Place`}
              </div>

              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {w.name}
              </h3>

              {w.description && (
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  {w.description}
                </p>
              )}

              {w.website && (
                <a
                  href={w.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-auto pt-5 text-sm font-medium text-gray-900 hover:gap-2 transition-all self-start"
                >
                  Visit <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
)}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {partners.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <PersonCard item={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Facilitators */}
      {facilitators.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-5 h-5 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-900">Facilitators</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilitators.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <PersonCard item={f} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Highlights */}
      {cohort.highlights?.length > 0 && (
        <section className="bg-gray-50 border-y border-gray-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Programme Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cohort.highlights.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="text-sm text-gray-700 leading-relaxed">{h}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Startups list */}
      {cohort.startupsList?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Participating Startups</h2>
          <div className="flex flex-wrap gap-2">
            {cohort.startupsList.map((s) => (
              <span key={s} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Join the next cohort</h2>
          <p className="text-white/60 max-w-xl mx-auto mb-6">Applications for Cohort 3.0 are open. Build your space-tech venture with us.</p>
          <Link to="/apply" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CohortPage;