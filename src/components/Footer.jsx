import React from 'react';
import { Home, Calendar, Activity, Film, BookOpen, Users, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (location.pathname === '/' && path !== 'team' && path !== 'about') {
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (path === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (path === 'team' || path === 'about') {
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

  const resourceLinks = [
    { label: 'Team', path: 'team', icon: BookOpen },
    { label: 'About', path: 'about', icon: Users },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden pt-24 pb-12 border-t border-white/5 w-full uppercase" id="footer">

      {/* Decorative Hazard Stripe Top */}
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,#df1f26,#df1f26_10px,#000_10px,#000_20px)] opacity-40"></div>

      <div className="container mx-auto px-6 relative z-10 md:pl-[11%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">

          {/* Section 1: InGen Corporate Overlay */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-2">
              <h2 className="text-5xl font-black italic tracking-tighter leading-none">INOVEX</h2>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.4em] text-red-600">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                Code the Future // Create the Change
              </div>
            </div>

            <p className="text-gray-500 text-[11px] leading-relaxed max-w-xs font-bold tracking-widest normal-case">
              ALL BIOLOGICAL ASSETS ON THIS SERVER ARE PROTECTED BY THE INGEN SECURITY DIVISION. UNAUTHORIZED DATA EXTRACTION IS PUNISHABLE BY INTERNATIONAL MARITIME LAW.
            </p>

            {/* Diagnostic Terminal Panel */}
            <div className="border border-white/5 bg-white/[0.02] p-5 rounded-sm space-y-4 max-w-xs">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-white/30 tracking-widest">System Integrity</span>
                <span className="text-[10px] font-black text-green-500 tracking-widest">98.4% STABLE</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[9px] font-black text-white/30 tracking-widest">Asset Sync</span>
                <span className="text-[10px] font-black text-red-600 tracking-widest animate-pulse">ACTIVE SCAN</span>
              </div>
            </div>
          </div>

          {/* Section 2: Protocols & Resources */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-8">
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

            <div className="space-y-8">
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

              <div className="space-y-3">
                <span className="text-[9px] font-black text-white/30 tracking-widest block uppercase">External Feed</span>
                <div className="flex gap-4 lg:justify-end">
                  <a href="#" className="p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all group">
                    <MessageSquare size={18} className="opacity-60 group-hover:opacity-100" />
                  </a>
                  <a href="#" className="flex items-center justify-center p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all text-[10px] font-black">
                    IG
                  </a>
                  <a href="#" className="flex items-center justify-center p-2 border border-white/10 hover:border-red-600 hover:text-red-600 transition-all text-[10px] font-black">
                    TW
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Footer Meta */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black tracking-[0.4em] text-white/20 md:pl-[15%]">
          <div className="flex items-center gap-4">
            <span>© 2026 INOVEX / INGEN</span>
            <span className="hidden md:block w-4 h-[1px] bg-white/10"></span>
            <span>ALL ASSETS SECURED</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-red-900/40">Diagnostic 07.B //</span>
            <span className="text-white/40">Containment Stable</span>
          </div>
        </div>
      </div>

      {/* Extreme Background Aesthetic */}
      <div className="absolute -bottom-10 -right-10 text-[25vw] font-black italic opacity-[0.02] pointer-events-none translate-y-20">
        INOVEX
      </div>

    </footer>
  );
};

export default Footer;
