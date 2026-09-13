import React, { useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, X } from "lucide-react";
import livelogo from "../images/Logo/centerLogo.png";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  const toggleDropdown2 = () => {
    setShowDropdown2((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setShowDropdown2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav className="fixed font-bold top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-4">
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl border border-[#e5e5e5] shadow-sm">
            <div className="px-6 py-4">
              <div className="grid grid-cols-3 items-center">
                {/* Left Links - Desktop */}
                <div className="hidden lg:flex font-bold justify-evenly items-center gap-1">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className="relative hover:bg-[#f5f5f5] flex font-bold items-center gap-2 px-4 py-2 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] "
                      tabIndex={0}
                      onClick={toggleDropdown}
                    >
                      SpaceFest
                      {showDropdown ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {showDropdown && (
                      <div className="absolute font-bold top-14 left-0 w-40 bg-white rounded-2xl shadow-lg  overflow-hidden z-50">
                        <div className="grid">
                          <NavLink to="/spacefest" className="hover:bg-gray-100 cursor-pointer p-3">
                            Spacefest
                          </NavLink>
                          <NavLink to="/hackathon" className="hover:bg-gray-100 cursor-pointer p-3">
                            Spacehacks
                          </NavLink>
                          <NavLink to="/portfolio" className="hover:bg-gray-100 cursor-pointer p-3">
                            Portfolio
                          </NavLink>
                          
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink to="/about">
                    {({ isActive }) => (
                      <button
                        className={`relative px-4 py-2 rounded-xl text-sm tracking-wide transition-all ${
                          isActive
                            ? "text-[#1a1a1a] font-bold"
                            : "text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        About

                        {isActive && (
                          <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
                        )}
                      </button>
                    )}
                  </NavLink>

                  <NavLink to="/apply">
                    {({ isActive }) => (
                      <button
                        className={`relative px-4 py-2 font-bold rounded-xl text-sm tracking-wide transition-all ${
                          isActive
                            ? "text-[#1a1a1a] font-bold"
                            : "text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        Apply

                        {isActive && (
                          <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
                        )}
                      </button>
                    )}
                  </NavLink>
                </div>

                {/* Logo - Centered on mobile */}
                <Link to="/" className="col-start-2 lg:col-start-auto">
                  <div className="flex justify-center items-center gap-3">
                    <img
                      src={livelogo}
                      className="w-25 h-25 absolute overflow-hidden rounded-full bg-white"
                    />
                  </div>
                </Link>

                {/* Right Links - Desktop */}
                <div className="hidden lg:flex justify-evenly items-center gap-1">
                  <NavLink to="/events">
                  {({ isActive }) => (
                    <button
                      className={`relative px-4 py-2 rounded-xl text-sm tracking-wide transition-all ${
                        isActive
                          ? "text-[#1a1a1a] font-bold"
                          : "text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      Events

                      {isActive && (
                        <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
                      )}
                    </button>
                  )}
                </NavLink>

                  {/* <NavLink to="/accelerator">
                    {({ isActive }) => (
                      <button
                        className={`relative px-4 py-2 rounded-xl text-sm tracking-wide transition-all ${
                          isActive
                            ? "text-[#1a1a1a] font-bold"
                            : "text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        Accelerator

                        {isActive && (
                          <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
                        )}
                      </button>
                    )}
                  </NavLink> */}

                  <div className="relative" ref={dropdownRef2}>
                    <button
                      className="relative hover:bg-[#f5f5f5] flex font-bold items-center gap-2 px-4 py-2 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] "
                      tabIndex={0}
                      onClick={toggleDropdown2}
                    >
                      Accelerator
                      {showDropdown2 ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {showDropdown2 && (
                      <div className="absolute font-bold top-14 left-0 w-60 bg-white rounded-2xl shadow-lg  overflow-hidden z-50">
                        <div className="grid">
                          <NavLink to="/accelerator/launch" className="hover:bg-gray-100 cursor-pointer p-3">
                            Launch of Accelerator
                          </NavLink>
                          <NavLink to="/accelerator/cohort-1" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 1
                          </NavLink>
                          <NavLink to="/accelerator/cohort-2" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 2
                          </NavLink>
                          <NavLink to="/accelerator/cohort-3" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 3
                          </NavLink>
                          <NavLink to="/accelerator/curriculum" className="hover:bg-gray-100 cursor-pointer p-3">
                            Curriculum
                          </NavLink>
                          
                        </div>
                      </div>
                    )}
                  </div>

                  <NavLink to="/gallery">
                    {({ isActive }) => (
                      <button
                        className={`relative px-4 py-2 rounded-xl text-sm tracking-wide transition-all ${
                          isActive
                            ? "text-[#1a1a1a] font-bold"
                            : "text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                        }`}
                      >
                        Gallery

                        {isActive && (
                          <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#1a1a1a] rounded-full"></div>
                        )}
                      </button>
                    )}
                  </NavLink>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  className="lg:hidden p-2 rounded-xl hover:bg-[#f5f5f5] transition-colors col-start-3 justify-self-end"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? (
                    <X size={24} strokeWidth={2} />
                  ) : (
                    <div className="space-y-1.5">
                      <div className="w-5 h-0.5 bg-[#1a1a1a]"></div>
                      <div className="w-5 h-0.5 bg-[#1a1a1a]"></div>
                      <div className="w-5 h-0.5 bg-[#1a1a1a]"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Mobile Menu */}
              {isMobileMenuOpen && (
                <div className="lg:hidden mt-4 pt-4 border-t border-[#e5e5e5]">
                  <div className="flex flex-col space-y-1">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#1a1a1a] font-medium hover:bg-[#f5f5f5]"
                        onClick={toggleDropdown}
                      >
                        SpaceFest
                        {showDropdown ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      {showDropdown && (
                        <div className=" bg-transparent rounded-xl  overflow-hidden">
                          <NavLink to="/spacefest" className="block hover:bg-gray-100 cursor-pointer p-3">
                            Spacefest
                          </NavLink>
                          <p className="hover:bg-gray-100 cursor-pointer p-3">
                            SpaceHacks
                          </p>
                          <p className="hover:bg-gray-100 cursor-pointer p-3">
                            More
                          </p>
                        </div>
                      )}
                    </div>

                    <NavLink 
                      to="/about" 
                      className="px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </NavLink>

                    <NavLink 
                      to="/apply" 
                      className="px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Apply
                    </NavLink>

                    <NavLink 
                      to="/events" 
                      className="px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Events
                    </NavLink>

                    <div className="relative" ref={dropdownRef2}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#1a1a1a] font-medium hover:bg-[#f5f5f5]"
                        onClick={toggleDropdown2}
                      >
                        SpaceFest
                        {showDropdown ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      {showDropdown2 && (
                        <div className=" bg-transparent rounded-xl  overflow-hidden">
                          <NavLink to="/accelerator/launch" className="hover:bg-gray-100 cursor-pointer p-3">
                            Launch of Accelerator
                          </NavLink>
                          <NavLink to="/accelerator/cohort-1" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 1
                          </NavLink>
                          <NavLink to="/accelerator/cohort-2" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 2
                          </NavLink>
                          <NavLink to="/accelerator/cohort-3" className="hover:bg-gray-100 cursor-pointer p-3">
                            Cohort 3
                          </NavLink>
                          <NavLink to="/accelerator/curriculum" className="hover:bg-gray-100 cursor-pointer p-3">
                            Curriculum
                          </NavLink>
                        </div>
                      )}
                    </div>

                    <NavLink 
                      to="/gallery" 
                      className="px-4 py-3 rounded-xl text-sm tracking-wide transition-all text-[#8a8a8a] hover:text-[#3a3a3a] hover:bg-[#f5f5f5]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Gallery
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;