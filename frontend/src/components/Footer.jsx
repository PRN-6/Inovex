import React from 'react';
import { Home, Calendar, Activity, Film, BookOpen, Users, MessageSquare, Mail, Phone, ShieldCheck, FileText } from 'lucide-react';

import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    const externalPages = ['team', 'about', 'privacy', 'terms', 'faq', 'contact'];

    if (location.pathname === '/' && !externalPages.includes(path)) {
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (path === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (['team', 'about', 'privacy', 'terms', 'faq', 'contact'].includes(path)) {
        navigate(`/${path}`);
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (path === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const protocolLinks = [
    { label: 'Home', path: 'home', icon: Home },
    { label: 'Events', path: 'events', icon: Calendar },
    { label: 'Timeline', path: 'timeline', icon: Activity },
    { label: 'Media', path: 'media', icon: Film },
  ];

  const eventsLinks = [
    { label: 'Techsaurus', path: 'events' },
    { label: 'Spy vs Spy', path: 'events' },
    { label: 'Rex Rampage', path: 'events' },
    { label: 'Cinesaur', path: 'events' },
    { label: 'Dinox', path: 'events' },
    { label: 'RexHack', path: 'events' },
    { label: 'Battle Nexus', path: 'events' },
    { label: 'Genesis Reborn', path: 'events' },
  ];

  const resourceLinks = [
    { label: 'Team', path: 'team', icon: BookOpen },
    { label: 'About', path: 'about', icon: Users },
    { label: 'FAQ', path: 'faq', icon: MessageSquare },
    { label: 'Contact', path: 'contact', icon: Phone },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', path: 'privacy', icon: ShieldCheck },
    { label: 'Terms & Conditions', path: 'terms', icon: FileText },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden pt-24 pb-12 border-t border-white/5 w-full uppercase" id="footer">

      {/* Decorative Hazard Stripe Top */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,#df1f26,#df1f26_10px,#000_10px,#000_20px)] opacity-40"></div>

      <div className="max-w-screen-2xl mx-auto pl-10 pr-6 relative z-10 md:pl-20 md:pr-12 lg:pl-48 lg:pr-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">

          {/* Section 1: InGen Corporate Overlay */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-none">INOVEX</h2>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                Code the Future // Create the Change
              </div>
            </div>

            <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs font-bold tracking-widest normal-case">
              ALL BIOLOGICAL ASSETS ON THIS SERVER ARE PROTECTED BY THE INOVEX SECURITY DIVISION. UNAUTHORIZED DATA EXTRACTION IS PUNISHABLE BY INTERNATIONAL MARITIME LAW.
            </p>

            {/* Diagnostic Terminal Panel */}
            <div className="border border-white/5 bg-white/[0.02] p-5 rounded-sm space-y-4 max-w-xs">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-white/30 tracking-widest uppercase">System Integrity</span>
                <span className="text-[10px] font-black text-green-500 tracking-widest">98.4% STABLE</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-white/30 tracking-widest uppercase">Asset Sync</span>
                <span className="text-[10px] font-black text-red-600 tracking-widest animate-pulse">ACTIVE SCAN</span>
              </div>
            </div>
          </div>

          {/* Section 2: Protocols, Events, Resources & Legal */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4">

            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-white/20"></span>
                Protocol
              </h3>
              <ul className="space-y-4">
                {protocolLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.path}`}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="text-xs font-black tracking-widest text-gray-400 hover:text-red-500 transition-all flex items-center gap-3"
                    >
                      <link.icon className="w-3.5 h-3.5 opacity-40" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-white/20"></span>
                Quests
              </h3>
              <ul className="space-y-4">
                {eventsLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.path}`}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="text-xs font-black tracking-widest text-gray-400 hover:text-red-500 transition-all flex items-center gap-3"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500/20 rounded-full group-hover:bg-red-500"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-white/20"></span>
                Resources
              </h3>
              <ul className="space-y-4">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.path}`}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="text-xs font-black tracking-widest text-gray-400 hover:text-red-500 transition-all flex items-center gap-3"
                    >
                      <link.icon className="w-3.5 h-3.5 opacity-40" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-white/20"></span>
                Legal
              </h3>
              <ul className="space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={`#${link.path}`}
                      onClick={(e) => handleNavClick(e, link.path)}
                      className="text-xs font-black tracking-widest text-gray-400 hover:text-red-500 transition-all flex items-center gap-3"
                    >
                      <link.icon className="w-3.5 h-3.5 opacity-40" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* Section 3: Connectivity & Geolocation */}
          <div className="lg:col-span-3 space-y-8 lg:text-right flex flex-col items-start lg:items-end">
            <h3 className="text-[10px] font-black tracking-[0.5em] text-white/40 flex items-center gap-3">
              <span className="w-6 h-[1px] bg-white/20"></span>
              SYNC
            </h3>

            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-white/30 tracking-widest block uppercase">Coordinate Delta</span>
                <span className="text-xs font-black tracking-widest text-white leading-relaxed">
                  07° 24′ N // 87° 00′ W<br />
                  Isla Nublar // Site-B
                </span>
              </div>

              <div className="space-y-1 ">
                <span className="text-[9px] font-black text-white/30 tracking-widest block uppercase">Contact InGen</span>
                <a href="mailto:inovex2026@gmail.com" className="text-xs font-black tracking-widest text-white hover:text-red-500 transition-all flex items-center gap-2 lg:justify-end lowercase">
                  <Mail className="w-3 h-3 opacity-40" />
                  inovex2026@gmail.com
                </a>
                <div className="text-xs font-black tracking-widest text-white flex items-center gap-2 lg:justify-end">
                  <Phone className="w-3 h-3 opacity-40" />
                  +91 93635 08381
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-black text-white/30 tracking-widest block uppercase">External Feed</span>
                <div className="flex gap-4 lg:justify-end">
                  <a href="#" className="p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all group" title="TERMINAL CHAT">
                    <MessageSquare size={18} className="opacity-60 group-hover:opacity-100" />
                  </a>
                  <a href="#" className="p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all group" title="INSTAGRAM FEED">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all group" title="YOUTUBE FEED">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Global Footer Meta */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black tracking-[0.4em] text-white/20">
          <div className="flex items-center gap-4 text-center md:text-left">
            <span>© 2026 INOVEX</span>
            <span className="hidden md:block w-4 h-[1px] bg-white/10"></span>
            <span>ALL ASSETS SECURED</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 text-center">
            <span className="text-red-900/40">Diagnostic 07.B //</span>
            <span className="text-white/40">Containment Stable</span>
          </div>
        </div>
      </div>

      {/* Extreme Background Aesthetic */}
      <div className="absolute -bottom-10 -right-10 text-[25vw] font-black italic opacity-[0.02] pointer-events-none translate-y-20 select-none overflow-hidden">
        INOVEX
      </div>

    </footer>
  );
};

export default Footer;
