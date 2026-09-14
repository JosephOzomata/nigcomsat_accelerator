// src/components/SmoothScroll.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom'

const SmoothScroll = ({ children }) => {
    const location = useLocation()
    const isAdmin = location.pathname.startsWith('/admin')
  useEffect(() => {
    if (isAdmin) return; // Disable smooth scrolling for admin routes
    const lenis = new Lenis({
      duration: 1.2,          // scroll easing duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease-out
      smoothWheel: true,
      smoothTouch: false,     // keep native feel on mobile (recommended)
      touchMultiplier: 2,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
};

export default SmoothScroll;