import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../hooks/useFirestore';
import { MessageSquare, Quote } from 'lucide-react';
import logo from '../images/Logo/superlogo.png';

const Testimonials = () => {
  const { data: testimonials, loading } = useFirestoreCollection('testimonials');
  const ordered = [...testimonials].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            
            <h1 className="text-4xl mt-5 md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              Voices from the Programme
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Founders, mentors, and partners share what the NIGCOMSAT Accelerator meant for them.
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
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {ordered.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
                <Quote className="w-6 h-6 text-gray-200 mb-4" />
                <p className="text-gray-700 leading-relaxed flex-1 mb-6">{t.quote}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                        {t.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{t.name}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {[t.role, t.company].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Testimonials;