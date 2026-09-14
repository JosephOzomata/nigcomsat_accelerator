// src/pages/cohorts/CurriculumPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Rocket,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Globe,
  Award,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { useFirestoreCollection } from '../../hooks/useFirestore';

/* Icon map — matches the string names stored in Firestore */
const ICONS = {
  Rocket,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Globe,
  Award,
  BookOpen,
};

const CurriculumPage = () => {
  const { data: modules, loading } = useFirestoreCollection('curriculum');

  const ordered = [...modules].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >

            <h1 className="text-4xl mt-5 md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              Inside the Programme
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              A structured journey through product development, business
              strategy, and space-tech fundamentals — designed to take early-stage
              startups from idea to investment-ready.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Programme structure */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              label: 'Product Development',
              value: '12 weeks',
              desc: 'Deep dive into product, prototyping, and market fit.',
              icon: Target,
            },
            {
              label: 'Business Development',
              value: '12 weeks',
              desc: 'Fundraising, market strategy, and investor readiness.',
              icon: TrendingUp,
            },
            {
              label: 'Demo Day',
              value: 'Finale',
              desc: 'Pitch to investors, policymakers, and industry leaders.',
              icon: Award,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {item.value}
                </div>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Modules */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Programme Modules
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Delivered through workshops, mentorship, expert sessions, and team
            projects.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            Loading curriculum...
          </div>
        ) : ordered.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-sm">
              Curriculum coming soon — check back shortly.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordered.map((module, i) => {
              const Icon = ICONS[module.icon] || BookOpen;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {module.title}
                        </h3>
                        {module.week && (
                          <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                            {module.week} Weeks
                          </span>
                        )}
                      </div>

                      {module.description && (
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {module.description}
                        </p>
                      )}

                      {module.topics?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {module.topics.map((t) => (
                            <span
                              key={t}
                              className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3 h-3 text-gray-400" />
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to build with us?
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Join the next cohort and turn your space-tech idea into a real venture.
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

export default CurriculumPage;