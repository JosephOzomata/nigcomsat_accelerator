// src/components/AboutSpaceFest.jsx
import { motion } from 'framer-motion';

const AboutSpaceFest = () => {
  return (
    <section className="bg-gray-50 border-b border-gray-200 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12"
        >
          {/* <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
              About
            </span>
          </div> */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            About SpaceFest
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
              Space Fest 2026 brought together university space clubs from
              across Nigeria in a nationwide celebration of research,
              innovation, and youth participation — part of NIGCOMSAT's 20th
              Anniversary commemorations.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
              Designed as both a competition and a national capacity-building
              initiative, Space Fest inspired young Nigerians to actively shape
              the future of Africa's space industry through original research,
              bold ideas, and strategic thinking.
            </p>

            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbT3VZMJGCU1W-igToBLVaN-2ANsG8dFI7XEGdJA-9tA&s=10"
                alt="SpaceFest participants"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5q_KMk3uabbFF82jZU4qYUg7iklzBfR5AswbZLQPYw&s=10"
                alt="SpaceFest"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSpaceFest;