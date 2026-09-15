import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Video, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import logo from '../images/Logo/superlogo.png';

const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[4/5]'];
const getAspect = (i) => ASPECTS[i % ASPECTS.length];

const Tile = ({ item, onClick, aspect }) => (
  <motion.button onClick={onClick} whileHover="hover"
    className={`group relative block w-full overflow-hidden rounded-xl bg-black border border-gray-200 ${aspect}`}>
    {item.type === 'video' ? (
      <video src={item.url} muted playsInline preload="metadata"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
    ) : (
      <img src={item.url} alt={item.filename || ''} loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    {item.type === 'video' && (
      <>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-[10px]">
          <Video size={10} /> VIDEO
        </div>
      </>
    )}
  </motion.button>
);

const Gallery = () => {
  const { data: items, loading } = useFirestoreCollection('gallery');
  const [lightbox, setLightbox] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  /* Group: parent -> subfolder -> items */
  const hierarchy = useMemo(() => {
    const parents = new Map(); // parent -> Map(subfolder -> items[])
    [...items]
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .forEach((item) => {
        const parent = item.parent || 'Uncategorised';
        const sub = item.subfolder || '__direct__';
        if (!parents.has(parent)) parents.set(parent, new Map());
        const subMap = parents.get(parent);
        if (!subMap.has(sub)) subMap.set(sub, []);
        subMap.get(sub).push(item);
      });
    return parents;
  }, [items]);

  const parentNames = Array.from(hierarchy.keys());

  const sectionsToRender =
    activeFilter === 'all'
      ? parentNames
      : parentNames.filter((p) => p === activeFilter);

  const openLightbox = (item, sourceItems) => {
    const index = sourceItems.findIndex((x) => x.id === item.id);
    setLightbox({ items: sourceItems, index: index >= 0 ? index : 0 });
  };
  const closeLightbox = () => setLightbox(null);
  const nextLightbox = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : null);
  const prevLightbox = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [lightbox]);

  if (loading) {
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
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            
            <h1 className="text-4xl mt-5 md:text-6xl font-bold text-gray-900 tracking-tight mb-4">Our Story in Frames</h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Photos and videos from NIGCOMSAT Accelerator events, cohorts, and the community shaping Africa's space future.
            </p>
          </motion.div>
        </div>
      </section>

      {parentNames.length > 0 && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                All
              </button>
              {parentNames.map((parent) => (
                <button key={parent} onClick={() => setActiveFilter(parent)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    activeFilter === parent ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {parent}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {parentNames.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-gray-500 text-sm">No photos or videos published yet.</p>
        </section>
      ) : (
        sectionsToRender.map((parent, pi) => {
          const subMap = hierarchy.get(parent);
          const subNames = Array.from(subMap.keys());
          const totalItems = subNames.reduce((sum, s) => sum + subMap.get(s).length, 0);
          return (
            <section key={parent} className={`py-14 md:py-20 ${pi % 2 === 1 ? 'bg-gray-50 border-y border-gray-200' : ''}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-px bg-black" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                      {String(pi + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{parent}</h2>
                  <p className="text-sm text-gray-500 mt-1">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </motion.div>

                {subNames.map((sub, si) => {
                  const subItems = subMap.get(sub);
                  const [heroItem, ...restItems] = subItems;
                  const showSubtitle = sub !== '__direct__';
                  return (
                    <div key={sub} className={si > 0 ? 'mt-16' : ''}>
                      {showSubtitle && (
                        <div className="flex items-end justify-between mb-5">
                          <h3 className="text-lg font-semibold text-gray-800">{sub}</h3>
                          <span className="text-xs text-gray-500">{subItems.length} item{subItems.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}

                      {heroItem && subItems.length === 1 && (
                        <Tile item={heroItem} aspect="aspect-[16/9] md:aspect-[21/9]" onClick={() => openLightbox(heroItem, subItems)} />
                      )}

                      {heroItem && subItems.length > 1 && (
                        <>
                          <div className="mb-4">
                            <Tile item={heroItem} aspect="aspect-[16/9] md:aspect-[21/9]" onClick={() => openLightbox(heroItem, subItems)} />
                          </div>
                          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
                            {restItems.map((item, i) => (
                              <motion.div key={item.id}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                                className="mb-4 break-inside-avoid">
                                <Tile item={item} aspect={getAspect(i)} onClick={() => openLightbox(item, subItems)} />
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      <AnimatePresence>
        {lightbox && currentItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">
              {lightbox.index + 1} / {lightbox.items.length}
            </div>
            {lightbox.items.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <motion.div key={currentItem.id}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()} className="max-w-6xl w-full max-h-[85vh] flex items-center justify-center">
              {currentItem.type === 'video' ? (
                <video src={currentItem.url} controls autoPlay playsInline className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
              ) : (
                <img src={currentItem.url} alt={currentItem.filename || ''} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;