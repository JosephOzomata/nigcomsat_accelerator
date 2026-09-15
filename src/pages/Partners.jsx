import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import PersonCard from '../components/PersonCard';
import logo from '../images/Logo/superlogo.png';

const Partners = () => {
  const { data: partners, loading } = useFirestoreCollection('partners');
  const { data: cohorts } = useFirestoreCollection('cohorts');

  const grouped = useMemo(() => {
    const sortedCohorts = [...cohorts].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    const map = new Map();
    sortedCohorts.forEach((c) => map.set(c.slug, { title: c.title, items: [] }));
    // Ungrouped (no cohort or unknown cohort) bucket
    const orphan = { title: 'Other Partners', items: [] };

    [...partners]
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .forEach((p) => {
        const bucket = map.get(p.cohortSlug);
        if (bucket) bucket.items.push(p);
        else orphan.items.push(p);
      });

    const result = Array.from(map.values()).filter((g) => g.items.length > 0);
    if (orphan.items.length > 0) result.push(orphan);
    return result;
  }, [partners, cohorts]);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium bg-black text-white rounded-full">Partners</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              Our Partners
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Organisations and institutions supporting the NIGCOMSAT Accelerator
              Programme across cohorts.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
      ) : grouped.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No partners published yet.</p>
        </div>
      ) : (
        grouped.map((group, gi) => (
          <section key={group.title} className={`py-16 ${gi % 2 === 1 ? 'bg-gray-50 border-y border-gray-200' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{group.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {group.items.length} partner{group.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.items.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                    <PersonCard item={p} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Partners;