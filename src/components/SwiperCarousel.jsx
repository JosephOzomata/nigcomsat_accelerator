// src/components/SwiperCarousel.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useFirestoreCollection } from '../hooks/useFirestore';
import logo from '../images/Logo/superlogo.png'

export default function SwiperCarousel() {
  const { data: slides, loading } = useFirestoreCollection('heroSlides');

  const ordered = [...slides].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  );

  if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col animate-pulse items-center gap-3">
            <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
          </div>
        </div>
      );
    }

  if (ordered.length === 0) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col font-semibold items-center gap-3">
            <img src={logo} alt="NIGCOMSAT Accelerator" className="w-16 h-16" />
            <p>Oops, You're Offline</p>
            <p>Connect to the internet and try again.</p>
          </div>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 11000, disableOnInteraction: true }}
      speed={1800}
      loop
      className="w-full h-screen"
    >
      {ordered.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative w-full h-screen overflow-hidden">
            {slide.type === 'video' ? (
              <video
                src={slide.src}
                poster={slide.poster || undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-screen object-cover"
              />
            ) : (
              <img
                src={slide.src}
                alt={slide.title || ''}
                className="w-full h-screen object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}