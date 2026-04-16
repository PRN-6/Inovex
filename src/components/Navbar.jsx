import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Users, BookOpen, Film, Calendar, Gamepad2, Newspaper, User, CreditCard, Palette, Volume2, MessageSquare, Settings } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
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
        // Open animation
        gsap.to(mobileMenuRef.current, { x: "0%", duration: 0.4, ease: "power3.inOut" });
      } else {
        // Close animation
        gsap.to(mobileMenuRef.current, { 
          x: "100%", 
          duration: 0.4, 
          ease: "power3.inOut"
        });
      }
    }
  }, [isMobileMenuOpen]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // If scrolled past first screen, set Events as active
      if (scrollPosition >= windowHeight * 0.5) {
        setActiveSection('events');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { icon: Home, label: 'Home', active: activeSection === 'home' },
    { icon: Calendar, label: 'Events', active: activeSection === 'events' },
    { icon: BookOpen, label: 'Team', active: false },
    { icon: Users, label: 'About', active: false },
  ];

  
  const socialIcons = [
    { icon: MessageSquare, label: 'Discord' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        ref={mobileMenuButtonRef}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <div 
        ref={desktopSidebarRef}
        className="group fixed left-0 top-0 h-full bg-black/80 backdrop-blur-md text-white z-40 hidden md:flex flex-col transition-all duration-300 ease-in-out w-16 hover:w-40 border-r border-red-900/30"
      >
        {/* Logo */}
        <div className="p-4 border-b border-red-900/30 flex items-center">
          <h1 className="text-xl font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-0 group-hover:w-auto overflow-hidden text-white">
            INOVEX
          </h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {mainNavItems.map((item, index) => (
              <li key={index} ref={el => navItemsRef.current[index] = el}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.label === 'Home') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (item.label === 'Events') {
                      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-3 transition-colors ${
                    item.active
                      ? 'bg-red-900/50 text-white border-l-2 border-red-500'
                      : 'hover:bg-red-900/30 text-gray-300'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 w-0 group-hover:w-auto overflow-hidden">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Icons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-around">
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
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
        className="fixed inset-0 bg-black/90 backdrop-blur-md text-white z-40 md:hidden"
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
          <div className="p-4 space-y-2">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.label === 'Home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (item.label === 'Events') {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-red-900/50 text-white border-l-4 border-red-500'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Social Icons */}
        {/* <div className="p-6 border-t border-red-900/30">
          <div className="flex justify-around">
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3V2z"/>
              </svg>
            </a>
            <a href="#" className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
            </a>
          </div>
        </div> */}
      </div>

    </>
  );
};

export default Navbar;
