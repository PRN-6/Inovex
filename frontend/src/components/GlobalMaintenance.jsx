import React from 'react';
import { Shield, Settings } from 'lucide-react';

const GlobalMaintenance = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(223,31,38,0.15)_0%,rgba(0,0,0,1)_70%)]" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        <div className="relative mb-8">
          <Shield size={80} className="text-red-600 animate-pulse" />
          <Settings size={30} className="text-white absolute -bottom-2 -right-2 animate-[spin_4s_linear_infinite]" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6">
          <span className="text-white">SYSTEM</span> <span className="text-red-600">UPGRADE</span>
        </h1>
        
        <p className="text-lg md:text-xl font-bold text-white/60 tracking-widest uppercase mb-8 leading-relaxed">
          The INOVEX central mainframe is currently undergoing scheduled maintenance and upgrades.
        </p>
        
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-black tracking-[0.2em] uppercase text-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
          OPERATIONS HALTED
        </div>
      </div>
      
      <div className="absolute bottom-10 text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">
        INOVEX CORE SYSTEM v2.4.0
      </div>
    </div>
  );
};

export default GlobalMaintenance;
