import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ShieldAlert, Database, MapPin, Clock, Search, Ghost } from 'lucide-react';

const About = () => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);

  const addToRefs = (el) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    gsap.fromTo(elementsRef.current,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out" 
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 overflow-hidden relative">
      
      {/* Background Grid & Scanlines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
           style={{
             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/scanlines.png')] mix-blend-overlay opacity-20"></div>

      {/* Extreme Background Text */}
      <div className="absolute top-40 -right-20 text-[20vw] font-black italic opacity-[0.02] pointer-events-none select-none leading-none z-0">
        CLASSIFIED
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10" ref={containerRef}>
        
        {/* Header */}
        <div className="mb-16 border-l-4 border-jurassic-yellow pl-6" ref={addToRefs}>
          <div className="flex items-center gap-3 text-jurassic-yellow mb-2">
            <ShieldAlert size={16} className="animate-pulse" />
            <span className="text-xs font-black tracking-[0.4em] uppercase">Highly Confidential File</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Project <span className="text-red-600">Inovex</span>
          </h1>
          <div className="flex items-center gap-6 text-xs font-black tracking-widest text-white/30 uppercase">
             <span>Facility: Main Campus</span>
             <span className="hidden md:inline">|</span>
             <span>Status: Incubation Phase</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Mission Brief */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0a0a0a] border border-white/10 p-8 relative overflow-hidden group" ref={addToRefs}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Database size={20} className="text-red-500" />
                <h2 className="text-2xl font-black uppercase tracking-wider text-white">Mission Overview</h2>
              </div>
              
              <div className="space-y-4 text-white/70 leading-relaxed font-light">
                <p>
                  Welcome to INOVEX, a premier technical and cultural symposium. What began as a mere experiment has morphed into a revolutionary timeline of events, blurring the line between technology and primal creativity. 
                </p>
                <p>
                  Our engineers have spared no expense to bring this festival to life. By extracting ideas from the bedrock of innovation and sequencing them with cultural talent, we have engineered an experience that cannot be contained. 
                </p>
                <div className="bg-jurassic-yellow/10 border-l-4 border-jurassic-yellow p-4 mt-6">
                  <p className="text-jurassic-yellow font-black text-sm uppercase tracking-widest">
                    WARNING: Attendance may result in extreme sensory overload and paradigm shifts.
                  </p>
                </div>
              </div>
            </div>

            {/* Event Lore/Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={addToRefs}>
              <div className="bg-[#0a0a0a] border border-white/10 p-6 hover:border-red-600/50 transition-colors">
                <Search size={24} className="text-jurassic-yellow mb-4" />
                <h3 className="text-xl font-bold uppercase mb-2">The Excavation</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Uncover buried talents in our flagship technical events and hackathons. Dig deep into the code and reconstruct legacy systems into modern marvels.
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-white/10 p-6 hover:border-red-600/50 transition-colors">
                <Ghost size={24} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold uppercase mb-2">The Apex Arena</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  Survive the ultimate gaming ecosystem where only the strongest competitors adapt, evolve, and conquer the leaderboards.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Data Core */}
          <div className="space-y-6" ref={addToRefs}>
            
            {/* Intel Panel */}
            <div className="bg-red-900/10 border border-red-900/30 p-6 relative">
              <h3 className="text-red-500 font-black tracking-widest uppercase text-sm mb-6 flex items-center justify-between">
                <span>System Intel</span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </h3>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1">
                    <MapPin size={18} className="text-white/40" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/40 uppercase mb-1">Sector Origin</span>
                    <span className="text-sm font-medium">Main Auditorium Hub & Engineering Complex</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1">
                    <Clock size={18} className="text-white/40" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/40 uppercase mb-1">Duration Cycle</span>
                    <span className="text-sm font-medium">3 Days of Uninterrupted Operation</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1">
                    <Database size={18} className="text-white/40" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white/40 uppercase mb-1">Capacity</span>
                    <span className="text-sm font-medium">Over 5000+ Subjects anticipated</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Caution Graphic */}
            <div className="border border-jurassic-yellow/30 bg-black overflow-hidden flex flex-col items-center justify-center p-8 relative">
              <div className="absolute inset-0 bg-[url('/scanlines.png')] mix-blend-overlay opacity-30"></div>
              <div className="absolute top-0 w-full h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ca8a04_10px,#ca8a04_20px)]"></div>
              <div className="absolute bottom-0 w-full h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ca8a04_10px,#ca8a04_20px)]"></div>
              
              <img src="/images/dino-skull.png" alt="Skull" className="w-24 opacity-50 mb-4 grayscale" onError={(e) => e.target.style.display = 'none'} />
              <div className="text-center z-10">
                <span className="block text-4xl font-black italic text-white tracking-widest leading-none mb-2">UNLEASH</span>
                <span className="block text-xl font-bold uppercase text-jurassic-yellow tracking-widest">The Future</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
