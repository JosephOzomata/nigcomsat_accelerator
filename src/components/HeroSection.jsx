// src/components/HeroSection.jsx
import { motion } from 'framer-motion';
import heroImage from '../images/hero.png';

const stats = [
  { value: '1728', label: 'Public Votes' },
  { value: '2', label: 'Research Tracks' },
  { value: '3', label: 'Finalists' },
  { value: '20', label: 'Years of Impact' },
];

const HeroSection = () => {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gray-400" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                20th Anniversary · 2026
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-4">
              SpaceFest
              <br />
              2026
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Nigeria's premier university space research showcase, bringing
              together the next generation of space scientists, engineers,
              policy leaders, and innovators.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src={heroImage}
                alt="SpaceFest"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;