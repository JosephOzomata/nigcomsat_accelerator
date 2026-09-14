// src/components/SpotLightPage.jsx
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import spotlight from '../images/Spotlight.png';

const content = {
  title: 'AstroHub Space Club',
  tagline: 'The Winning Research',
  desc: 'The project stood out for its strong policy-focused approach, originality, and relevance to Nigeria\u2019s evolving space sector — with a compelling emphasis on creating a more inclusive, investment-friendly regulatory environment for the national space economy.',
};

const SpotLightPage = () => {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700 mb-5">
              <Trophy className="w-3.5 h-3.5" />
              Winner
            </div> */}

            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
              {content.tagline}
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              {content.title}
            </h2>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {content.desc}
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src={spotlight}
                alt={content.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpotLightPage;