// src/pages/Gallery.jsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import logo from '../images/Logo/superlogo.png';

/* ---------- Aspect ratio pool for masonry tiles ----------
   Rotated by index so adjacent tiles rarely share the same shape */
const ASPECTS = [
  'aspect-[4/5]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-[4/3]',
  'aspect-square',
  'aspect-[3/4]',
  'aspect-[5/4]',
  'aspect-[4/5]',
];

const getAspect = (index) => ASPECTS[index % ASPECTS.length];

/* ============================================================
   Tile — image or video thumbnail with hover state
   ============================================================ */
const Tile = ({ item, onClick, aspect, className = '' }) => (
  <motion.button
    onClick={onClick}
    whileHover="hover"
    initial="rest"
    className={`group relative block w-full overflow-hidden rounded-xl bg-black border border-gray-200 ${aspect} ${className}`}
  >
    {item.type === 'video' ? (
      <video
        src={item.url}
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    ) : (
      <motion.img
        src={item.url}
        alt={item.filename || ''}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    )}

    {/* Dark gradient at bottom for legibility */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Video badge */}
    {item.type === 'video' && (
      <>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium">
          <Video size={10} /> VIDEO
        </div>
      </>
    )}

    {/* Filename on hover */}
    {item.filename && (
      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-xs text-white/90 truncate">{item.filename}</p>
      </div>
    )}
  </motion.button>
);

/* ============================================================
   Gallery Page
   ============================================================ */
const Gallery = () => {
  const { data: categories, loading: loadingCats } =
    useFirestoreCollection('galleryCategories');
  const { data: items, loading: loadingItems } =
    useFirestoreCollection('gallery');

  const [lightbox, setLightbox] = useState(null); // { items: [...], index: n, category: '...' }
  const [activeFilter, setActiveFilter] = useState('all');

  /* ---------- Sort categories & group items ---------- */
  const orderedCategories = useMemo(
    () =>
      [...categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
    [categories]
  );

  const itemsByCategory = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      if (!map[it.category]) map[it.category] = [];
      map[it.category].push(it);
    });
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });
    return map;
  }, [items]);

  // Only categories that actually have items
  const visibleCategories = orderedCategories.filter(
    (c) => (itemsByCategory[c.name]?.length || 0) > 0
  );

  // Apply filter
  const sectionsToRender =
    activeFilter === 'all'
      ? visibleCategories
      : visibleCategories.filter((c) => c.name === activeFilter);

  /* ---------- Lightbox helpers ---------- */
  const openLightbox = (item, sectionItems) => {
    const index = sectionItems.findIndex((x) => x.id === item.id);
    setLightbox({ items: sectionItems, index: index >= 0 ? index : 0 });
  };

  const closeLightbox = () => setLightbox(null);

  const nextLightbox = () => {
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : null
    );
  };

  const prevLightbox = () => {
    setLightbox((lb) =>
      lb
        ? {
            ...lb,
            index: (lb.index - 1 + lb.items.length) % lb.items.length,
          }
        : null
    );
  };

  /* ---------- Keyboard navigation for lightbox ---------- */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  /* ---------- Loading ---------- */
  if (loadingCats || loadingItems) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col animate-pulse items-center gap-3">
          <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
        </div>
      </div>
    );
  }

  const currentItem = lightbox ? lightbox.items[lightbox.index] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* ============ HERO ============ */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            
            <h1 className="text-4xl mt-5 md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
              Our Story in Frames
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Photos and videos from NIGCOMSAT Accelerator events, cohorts, and
              the community shaping Africa's space future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ FILTER TABS ============ */}
      {visibleCategories.length > 0 && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({items.length})
              </button>
              {visibleCategories.map((cat) => {
                const count = itemsByCategory[cat.name]?.length || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                      activeFilter === cat.name
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ EMPTY ============ */}
      {visibleCategories.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-gray-500 text-sm">
            No photos or videos published yet.
          </p>
        </section>
      ) : (
        sectionsToRender.map((cat, sectionIdx) => {
          const sectionItems = itemsByCategory[cat.name] || [];
          const [heroItem, ...restItems] = sectionItems;

          return (
            <section
              key={cat.id}
              className={`py-14 md:py-20 ${
                sectionIdx % 2 === 1
                  ? 'bg-gray-50 border-y border-gray-200'
                  : ''
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="flex items-end justify-between mb-8 md:mb-10 flex-wrap gap-3"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-px bg-black" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {String(sectionIdx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                      {cat.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    {sectionItems.length} item
                    {sectionItems.length !== 1 ? 's' : ''}
                  </p>
                </motion.div>

                {/* Hero tile — first item, wide */}
                {heroItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <Tile
                      item={heroItem}
                      onClick={() => openLightbox(heroItem, sectionItems)}
                      aspect="aspect-[16/9] md:aspect-[21/9]"
                    />
                  </motion.div>
                )}

                {/* Masonry below — rest of items */}
                {restItems.length > 0 && (
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
                    {restItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                        className="mb-4 break-inside-avoid"
                      >
                        <Tile
                          item={item}
                          onClick={() => openLightbox(item, sectionItems)}
                          aspect={getAspect(i)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })
      )}

      {/* ============ LIGHTBOX ============ */}
      <AnimatePresence>
        {lightbox && currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">
              {lightbox.index + 1} / {lightbox.items.length}
            </div>

            {/* Prev */}
            {lightbox.items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next */}
            {lightbox.items.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full max-h-[85vh] flex items-center justify-center"
            >
              {currentItem.type === 'video' ? (
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
                />
              ) : (
                <img
                  src={currentItem.url}
                  alt={currentItem.filename || ''}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
              )}
            </motion.div>

            {/* Filename */}
            {currentItem.filename && (
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                {currentItem.filename}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;