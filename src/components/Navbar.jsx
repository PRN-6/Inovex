import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, BookOpen, Film, Calendar, Gamepad2, Newspaper, User, CreditCard, Palette, Volume2, MessageSquare, Settings } from 'lucide-react';
import { gsap } from 'gsap';

const mainNavItems = [
  { icon: Home, label: 'Home', path: 'home' },
  { icon: Calendar, label: 'Events', path: 'events' },
  { icon: Film, label: 'Media', path: 'media' },
  { icon: BookOpen, label: 'Team', path: 'team' },
  { icon: Users, label: 'About', path: 'about' },
];

const socialIcons = [
  { icon: MessageSquare, label: 'Discord' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Hide navbar on event details page
  if (location.pathname.startsWith('/event/')) {
    return null;
  }

  // GSAP refs
  const desktopSidebarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef([]);
  const mobileMenuButtonRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    // Set initial mobile menu position to hidden
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { x: "100%" });
    }

    // Animate desktop sidebar on load
    gsap.fromTo(desktopSidebarRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    // Animate mobile menu button on load
    gsap.fromTo(mobileMenuButtonRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.3 }
    );

    // Animate nav items staggered
    gsap.fromTo(navItemsRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.to(mobileMenuRef.current, { x: "0%", duration: 0.4, ease: "power3.inOut" });
      } else {
        gsap.to(mobileMenuRef.current, { x: "100%", duration: 0.4, ease: "power3.inOut" });
      }
    }
  }, [isMobileMenuOpen]);

  // Optimized Scroll detection with requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (location.pathname !== '/') return;

          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;

          if (scrollPosition < windowHeight * 0.5) {
            setActiveSection('home');
          } else if (scrollPosition >= windowHeight * 0.5 && scrollPosition < windowHeight * 1.5) {
            setActiveSection('events');
          } else {
            setActiveSection('media');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Update active section based on current route
  useEffect(() => {
    if (location.pathname === '/media') {
      setActiveSection('media');
    } else if (location.pathname === '/events') {
      setActiveSection('events');
    } else if (location.pathname === '/' && activeSection === 'media') {
        // preserve if scrolled there
    }
  }, [location.pathname]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (item.label === 'Home') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
      }
    } else if (item.label === 'Events') {
      if (location.pathname === '/') {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      } else {
        navigate('/events');
      }
    } else if (item.label === 'Media') {
      if (location.pathname === '/') {
        window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' });
      } else {
        navigate('/media');
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        ref={mobileMenuButtonRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div
        ref={desktopSidebarRef}
        className="group fixed left-0 top-0 h-full bg-black/80 backdrop-blur-md text-white z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out w-16 hover:w-40 border-r border-red-900/30"
      >
        {/* Logo */}
        <div className="p-4 border-b border-red-900/30 flex items-center h-16">
          <h1 className="text-xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-0 group-hover:w-auto overflow-hidden text-white whitespace-nowrap">
            INOVEX
          </h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <ul className="space-y-1">
            {mainNavItems.map((item, index) => (
              <li key={index} ref={el => navItemsRef.current[index] = el}>
                <a
                  href={`#${item.path}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center gap-3 px-3 py-3 transition-colors ${activeSection === item.path
                      ? 'bg-red-900/50 text-white border-l-2 border-red-500'
                      : 'hover:bg-red-900/30 text-gray-300'
                    }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden whitespace-nowrap">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="p-4 border-t border-red-900/30">
          <div className="flex justify-around">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-red-900/30 rounded-lg"
                title={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-black/90 backdrop-blur-md text-white z-40 md:hidden flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-red-900/30">
          <h1 className="text-2xl font-bold tracking-wider text-white">INOVEX</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4 pt-10">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.path}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all ${activeSection === item.path
                    ? 'bg-red-900/60 text-white border-l-4 border-red-500'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={24} />
                  <span className="text-lg font-semibold">{item.label}</span>
                </div>
                <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
