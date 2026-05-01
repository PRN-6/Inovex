import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, BookOpen, Film, Calendar, Gamepad2, Newspaper, User, CreditCard, Palette, Volume2, MessageSquare, Settings, Activity, Info, UserPlus } from 'lucide-react';
import { gsap } from 'gsap';
import FeedbackModal from './FeedbackModal';

const isBackendDisabled = import.meta.env.VITE_DISABLE_BACKEND === 'true';

const mainNavItems = [
  { icon: Home, label: 'Home', path: 'home' },
  { icon: Calendar, label: 'Events', path: 'events' },
  { icon: Activity, label: 'Timeline', path: 'timeline' },
  { icon: Film, label: 'Media', path: 'media' },
  { icon: Users, label: 'Team', path: 'team' },
  { icon: Info, label: 'About', path: 'about' },
  ...(isBackendDisabled ? [] : [{ icon: UserPlus, label: 'Register', path: 'register' }]),
];


const socialIcons = [
  { icon: MessageSquare, label: 'Feedback' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeoutRef = useRef(null);

  // Hide navbar on specific pages
  if (location.pathname.startsWith('/event/') || location.pathname === '/inovex-terminal-2026') {
    return null;
  }

  // GSAP refs
  const desktopSidebarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef([]);
  const mobileMenuButtonRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial mobile menu position to hidden
      if (mobileMenuRef.current) {
        gsap.set(mobileMenuRef.current, { x: "100%" });
      }

      // Animate desktop sidebar on load
      if (desktopSidebarRef.current) {
        gsap.fromTo(desktopSidebarRef.current,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }

      // Animate mobile menu button on load
      if (mobileMenuButtonRef.current) {
        gsap.fromTo(mobileMenuButtonRef.current,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.3 }
        );
      }

      // Animate nav items staggered
      const navItems = navItemsRef.current.filter(item => item !== null);
      if (navItems.length > 0) {
        gsap.fromTo(navItems,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
        );
      }
    });

    return () => ctx.revert();
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

          const windowHeight = window.innerHeight;
          const sections = ['home', 'events', 'timeline', 'media'];
          let currentSection = 'home';

          for (const sectionId of sections) {
            const element = document.getElementById(sectionId);
            if (element) {
              const rect = element.getBoundingClientRect();
              // If the top of the section is near the top of the viewport
              if (rect.top <= windowHeight * 0.4) {
                currentSection = sectionId;
              }
            }
          }
          setActiveSection(currentSection);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  // Update active section based on current route
  useEffect(() => {
    if (location.pathname === '/media') {
      setActiveSection('media');
    } else if (location.pathname === '/events') {
      setActiveSection('events');
    } else if (location.pathname === '/timeline') {
      setActiveSection('timeline');
    } else if (location.pathname === '/team') {
      setActiveSection('team');
    } else if (location.pathname === '/about') {
      setActiveSection('about');
    } else if (location.pathname === '/register') {
      setActiveSection('register');
    } else if (location.pathname === '/' && activeSection === 'media') {
      // preserve if scrolled there
    }
  }, [location.pathname]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    if (location.pathname === '/' && item.path !== 'team' && item.path !== 'about' && item.path !== 'register') {
      const element = document.getElementById(item.path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(item.path);
      } else {
        // Fallback for sections not yet rendered or missing IDs
        if (item.label === 'Home') window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (item.path === 'team') {
        navigate('/team');
      } else if (item.path === 'about') {
        navigate('/about');
      } else if (item.path === 'register') {
        navigate('/register');
      } else {
        // Navigate to home and scroll to section after mount
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(item.path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(item.path);
          } else if (item.label === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('home');
          }
        }, 100);
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
        className={`fixed top-4 right-4 z-50 md:hidden p-3 rounded-xl transition-all duration-300 shadow-lg border ${isMobileMenuOpen
            ? 'bg-red-600 text-white border-red-400'
            : 'bg-black/60 backdrop-blur-md text-red-500 border-red-900/50 hover:bg-red-900/20'
          }`}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div
        ref={desktopSidebarRef}
        className="group fixed left-0 top-0 h-full bg-black/80 backdrop-blur-md text-white z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out w-16 hover:w-40 border-r border-red-900/30 shadow-[10px_0_30px_rgba(0,0,0,0.8)] shadow-red-950/20"
      >
        {/* Logo */}
        <div
          className="p-4 border-b border-red-900/30 flex items-center h-16 cursor-pointer"
          onClick={() => {
            setLogoClicks(prev => prev + 1);
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = setTimeout(() => setLogoClicks(0), 3000);
            if (logoClicks + 1 >= 5) {
              navigate('/inovex-terminal-2026');
              setLogoClicks(0);
            }
          }}
        >
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
              <button
                key={index}
                onClick={() => social.label === 'Feedback' ? setIsFeedbackOpen(true) : null}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-red-900/30 rounded-lg w-full flex justify-center cursor-pointer"
                title={social.label}
              >
                <social.icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

      {/* Desktop Top-Right Register Button (Home Page Only) */}
      {location.pathname === '/' && !isBackendDisabled && (
        <button
          onClick={(e) => handleNavClick(e, mainNavItems.find(i => i.path === 'register'))}
          className="fixed top-8 right-8 z-50 hidden md:flex items-center gap-3 px-8 py-3 bg-red-600 text-white font-black italic tracking-[0.2em] skew-x-[-12deg] shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-white hover:text-red-600 transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-red-600"
        >
          <div className="skew-x-[12deg] flex items-center gap-3">
            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
            <span>REGISTER NOW</span>
          </div>
        </button>
      )}

      {/* Mobile Menu - Full Screen */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl text-white z-40 md:hidden flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.9)]"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between border-b border-red-900/20"
          onClick={() => {
            setLogoClicks(prev => prev + 1);
            if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = setTimeout(() => setLogoClicks(0), 3000);
            if (logoClicks + 1 >= 5) {
              navigate('/inovex-terminal-2026');
              setLogoClicks(0);
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <h1 className="text-2xl font-black tracking-[0.2em] text-red-600">INOVEX</h1>
          <div className="w-10 h-10" /> {/* Spacer for button */}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3 pt-10 pb-20">
            {mainNavItems.filter(item => item.path !== 'register').map((item, index) => (
              <a
                key={index}
                href={`#${item.path}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-300 border ${activeSection === item.path
                  ? 'bg-red-950/40 text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]'
                  : 'bg-zinc-900/30 text-gray-400 border-white/5'
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-2 rounded-lg ${activeSection === item.path ? 'bg-red-600/20' : 'bg-white/5'}`}>
                    <item.icon size={22} className={activeSection === item.path ? 'text-red-500' : 'text-gray-500'} />
                  </div>
                  <span className={`text-lg tracking-wider ${activeSection === item.path ? 'font-bold' : 'font-medium'}`}>
                    {item.label.toUpperCase()}
                  </span>
                </div>
                <div className={`w-2 h-2 rounded-full ${activeSection === item.path ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-zinc-800'}`} />
              </a>
            ))}

            {/* Mobile Feedback Link */}
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-300 border bg-zinc-900/30 text-gray-400 border-white/5 hover:bg-red-950/20 hover:text-red-500 hover:border-red-500/30"
            >
              <div className="flex items-center gap-5">
                <div className="p-2 rounded-lg bg-white/5">
                  <MessageSquare size={22} className="text-gray-500" />
                </div>
                <span className="text-lg tracking-wider font-medium">
                  FEEDBACK
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-zinc-800" />
            </button>

            {/* Prominent Register Button */}
            {!isBackendDisabled && (
              <button
              onClick={(e) => handleNavClick(e, mainNavItems.find(i => i.path === 'register'))}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl transition-all duration-300 bg-red-600 text-white font-black italic tracking-[0.2em] shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:bg-red-500 active:scale-95"
            >
              <UserPlus size={22} />
              REGISTER NOW
            </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
