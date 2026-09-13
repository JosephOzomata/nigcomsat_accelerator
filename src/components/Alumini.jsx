// src/components/Alumini.jsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../hooks/useFirestore';

const Alumini = () => {
  const { data: rawAlumni, loading } = useFirestoreCollection('alumni');

  const alumni = useMemo(
    () =>
      [...rawAlumni].sort(
        (a, b) => (a.order ?? 999) - (b.order ?? 999)
      ),
    [rawAlumni]
  );

  const carouselItems = alumni.slice(0, 5);
  const gridItems = alumni.slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="w-full px-6 py-8 bg-white">
        <div className="h-[420px] bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (alumni.length === 0) return null;

  return (
    <motion.div
      className="w-full px-6 py-8 bg-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light tracking-wider text-black uppercase">
          NigComSat Accelerator Alumni
        </h2>
        <div className="w-16 h-0.5 mx-auto mt-3 bg-black" />
        <p className="mt-3 text-sm font-light tracking-wide text-gray-500">
          Space-Tech · Innovation Driven · Future Leaders
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Carousel */}
        <div className="relative overflow-hidden rounded-lg bg-gray-100 h-[420px] shadow-sm">
          <motion.div
            className="flex h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            transition={{ ease: 'easeInOut', duration: 0.7 }}
            animate={{ x: 0 }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col items-start justify-end w-full h-full flex-shrink-0 p-8 text-white bg-gradient-to-t from-black/80 via-black/30 to-transparent"
                style={{
                  backgroundImage: item.image
                    ? `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%), url(${item.image})`
                    : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                  backgroundColor: '#1a1a1a',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {item.cohort && (
                  <span className="px-3 py-1 mb-3 text-[10px] font-medium tracking-widest uppercase border border-white/30 bg-black/30">
                    Cohort {item.cohort}
                  </span>
                )}
                <h3 className="text-2xl font-light tracking-wide">
                  {item.name}
                </h3>
                {item.founder && (
                  <p className="mt-1 text-sm font-light text-gray-300">
                    Founder: {item.founder}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-gray-200 max-w-md line-clamp-3">
                  {item.description}
                </p>
                {item.category && (
                  <div className="mt-3 text-[10px] font-medium tracking-widest uppercase text-gray-300">
                    {item.category}
                  </div>
                )}
              </div>
            ))}
          </motion.div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-white scale-110'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 text-xs font-light tracking-wider text-white/60">
            {currentIndex + 1} / {carouselItems.length}
          </div>
        </div>

        {/* RIGHT: Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {gridItems.map((item) => (
            <motion.a
              key={item.id}
              href={item.website || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-5 overflow-hidden transition-all duration-300 border border-gray-200 rounded-lg bg-white hover:shadow-xl hover:-translate-y-1"
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            >
              <div className="absolute top-0 left-0 w-0 h-0.5 transition-all duration-300 bg-black group-hover:w-full" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-widest text-gray-400 uppercase">
                    {item.category}
                  </span>
                  <span className="text-[9px] font-light text-gray-300">
                    C{item.cohort}
                  </span>
                </div>
                <h4 className="mt-2 text-base font-light tracking-wide text-black">
                  {item.name}
                </h4>
                {item.founder && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    {item.founder}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-3 text-right opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xs text-black">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] font-light tracking-widest text-gray-400 uppercase">
          Compiled from publicly available NigComSat Space Accelerator program
          information
        </p>
      </div>
    </motion.div>
  );
};

export default Alumini;