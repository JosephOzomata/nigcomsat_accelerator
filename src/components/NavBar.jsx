// src/components/NavBar.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import livelogo from '../images/Logo/centerLogo.png';

const spacefestLinks = [
  { to: '/spacefest', label: 'Spacefest' },
  { to: '/hackathon', label: 'Spacehacks' },
  { to: '/portfolio', label: 'Portfolio' },
];

const acceleratorLinks = [
  { to: '/accelerator', label: 'Accelerator' },
  { to: '/accelerator/launch', label: 'Launch of Accelerator' },
  { to: '/accelerator/cohort-1', label: 'Cohort 1' },
  { to: '/accelerator/cohort-2', label: 'Cohort 2' },
  { to: '/accelerator/cohort-3', label: 'Cohort 3' },
  { to: '/accelerator/curriculum', label: 'Curriculum' },
];

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [showMobileDropdown2, setShowMobileDropdown2] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const desktopDropdownRef2 = useRef(null);
  const location = useLocation();

  /* Close everything on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
    setShowDropdown2(false);
    setShowMobileDropdown(false);
    setShowMobileDropdown2(false);
  }, [location.pathname]);

  /* Lock body scroll while the mobile menu is open */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  /* Close desktop dropdowns on outside click */
  useEffect(() => {
    const handle = (e) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
      if (
        desktopDropdownRef2.current &&
        !desktopDropdownRef2.current.contains(e.target)
      ) {
        setShowDropdown2(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* Auto-close mobile menu on resize to desktop */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopLinkClass = ({ isActive }) =>
    `relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
      isActive
        ? 'text-[#1a1a1a]'
        : 'text-[#8a8a8a] hover:text-[#1a1a1a] hover:bg-[#f5f5f5]'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
      isActive
        ? 'bg-[#f5f5f5] text-[#1a1a1a]'
        : 'text-[#8a8a8a] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
    }`;

  return (
    <nav className="fixed top-0 mt-2 left-0 right-0 z-50">
      <div className="mx-3 sm:mx-4 mt-3 sm:mt-4">
        <div className="max-w-7xl mx-auto bg-white/85 backdrop-blur-lg rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="px-6 sm:px-6 lg:py-3 py-6">
            {/* ===== Top row ===== */}
            <div className="relative flex items-center justify-center lg:justify-between">
              {/* Left — desktop only */}
              <div className="hidden lg:flex flex-1 items-center gap-1">
                {/* SpaceFest dropdown */}
                <div className="relative" ref={desktopDropdownRef}>
                  <button
                    onClick={() => setShowDropdown((p) => !p)}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      showDropdown
                        ? 'bg-[#f5f5f5] text-[#1a1a1a]'
                        : 'text-[#8a8a8a] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
                    }`}
                  >
                    SpaceFest
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        showDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-12 left-0 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden py-1"
                      >
                        {spacefestLinks.map((l) => (
                          <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'bg-[#f5f5f5] font-bold'
                                  : 'hover:bg-[#f5f5f5]'
                              }`
                            }
                          >
                            {l.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink to="/about" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      About
                      {isActive && (
                        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a1a1a] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink to="/apply" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      Apply
                      {isActive && (
                        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a1a1a] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              </div>

              {/* Logo — centered on mobile */}
              <Link to="/" className="col-start-2 lg:col-start-auto">
                  <div className="flex justify-center items-center gap-3">
                    <img
                      src={livelogo}
                      className="w-25 h-25 absolute overflow-hidden rounded-full bg-white"
                    />
                  </div>
                </Link>

              {/* Right — desktop only */}
              <div className="hidden lg:flex flex-1 items-center justify-end gap-1">
                <NavLink to="/events" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      Events
                      {isActive && (
                        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a1a1a] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Accelerator dropdown */}
                <div className="relative" ref={desktopDropdownRef2}>
                  <button
                    onClick={() => setShowDropdown2((p) => !p)}
                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      showDropdown2
                        ? 'bg-[#f5f5f5] text-[#1a1a1a]'
                        : 'text-[#8a8a8a] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'
                    }`}
                  >
                    Accelerator
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        showDropdown2 ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showDropdown2 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-12 right-0 w-60 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden py-1"
                      >
                        {acceleratorLinks.map((l) => (
                          <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? 'bg-[#f5f5f5] font-bold'
                                  : 'hover:bg-[#f5f5f5]'
                              }`
                            }
                          >
                            {l.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <NavLink to="/gallery" className={desktopLinkClass}>
                  {({ isActive }) => (
                    <>
                      Gallery
                      {isActive && (
                        <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1a1a1a] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              </div>

              {/* Hamburger — mobile only, absolutely positioned right */}
              <button
                onClick={() => setIsMobileMenuOpen((p) => !p)}
                className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-[#f5f5f5] transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* ===== Mobile menu ===== */}
            <AnimatePresence initial={false}>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="lg:hidden overflow-hidden"
                >
                  <div className="pt-4 mt-3 border-t border-[#e5e5e5] flex flex-col gap-1 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                    {/* SpaceFest accordion */}
                    <div>
                      <button
                        onClick={() => setShowMobileDropdown((p) => !p)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          showMobileDropdown
                            ? 'bg-[#f5f5f5] text-[#1a1a1a]'
                            : 'text-[#8a8a8a] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        SpaceFest
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            showMobileDropdown ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {showMobileDropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 flex flex-col">
                              {spacefestLinks.map((l) => (
                                <NavLink
                                  key={l.to}
                                  to={l.to}
                                  className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                                      isActive
                                        ? 'bg-[#f5f5f5] font-bold'
                                        : 'text-[#8a8a8a] hover:bg-[#f5f5f5]'
                                    }`
                                  }
                                >
                                  {l.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <NavLink to="/about" className={mobileLinkClass}>
                      About
                    </NavLink>
                    <NavLink to="/apply" className={mobileLinkClass}>
                      Apply
                    </NavLink>
                    <NavLink to="/events" className={mobileLinkClass}>
                      Events
                    </NavLink>

                    {/* Accelerator accordion */}
                    <div>
                      <button
                        onClick={() => setShowMobileDropdown2((p) => !p)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                          showMobileDropdown2
                            ? 'bg-[#f5f5f5] text-[#1a1a1a]'
                            : 'text-[#8a8a8a] hover:bg-[#f5f5f5]'
                        }`}
                      >
                        Accelerator
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            showMobileDropdown2 ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {showMobileDropdown2 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 flex flex-col">
                              {acceleratorLinks.map((l) => (
                                <NavLink
                                  key={l.to}
                                  to={l.to}
                                  className={({ isActive }) =>
                                    `block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                                      isActive
                                        ? 'bg-[#f5f5f5] font-bold'
                                        : 'text-[#8a8a8a] hover:bg-[#f5f5f5]'
                                    }`
                                  }
                                >
                                  {l.label}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <NavLink to="/gallery" className={mobileLinkClass}>
                      Gallery
                    </NavLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;