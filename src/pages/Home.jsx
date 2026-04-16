import React from 'react'

const Home = () => {
  return (
    <div 
      className="relative min-h-screen w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 overflow-hidden bg-black"
      style={{ 
        backgroundImage: 'url(/images/hero.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'top right', 
        backgroundPositionX: '82%'
      }}
    >
      {/* Cinematic dark gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/40 to-transparent pointer-events-none"></div>

      {/* Arknights-inspired Bottom Left Branding Container */}
      <div className="relative z-10 flex flex-col max-w-5xl md:mx-18">
        
        {/* Top Tagline / Category Tag */}
        <div className="hidden md:flex items-center gap-4 mb-6 md:mb-8 bg-black/40 backdrop-blur-md w-fit px-4 py-1 border-l-2 border-jurassic-yellow">
          <div className="w-2 h-2 rounded-full bg-jurassic-yellow shadow-[0_0_8px_#f9d423] animate-pulse"></div>
          <p className="text-[10px] md:text-sm font-black tracking-[0.4em] text-white/90 uppercase">
            // STATUS: LIVE // COLLEGE FEST 2026 : INOVEX
          </p>
        </div>

        {/* Horizontal Red Accent Line with Highlight Shimmer */}
        <div className="w-24 md:w-48 h-1 bg-jurassic-red mb-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-white/40 skew-x-[-45deg] animate-shimmer"></div>
        </div>

        {/* Main Cinematic Title */}
        <h1 className="text-7xl md:text-9xl lg:text-[6rem] font-black text-white leading-[0.85] tracking-tighter uppercase mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          INOVEX
        </h1>

        {/* Red Thick Accent Line with Shimmer */}
        <div className="w-full md:w-100 h-3 md:h-5 bg-jurassic-red relative overflow-hidden mb-10 shadow-[0_0_20px_rgba(223,31,38,0.4)]">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-white/20 skew-x-[-45deg] animate-shimmer"></div>
        </div>

        {/* Event Categories & Footer Text */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {['IT MANAGER', 'TREASURE HUNT', 'GAMING', 'PRODUCT LAUNCH', 'WEB DESIGN'].map((event) => (
              <span key={event} className="text-[10px] md:text-xs font-bold text-white/50 border border-white/20 px-3 py-1 tracking-widest hover:border-jurassic-yellow hover:text-white transition-colors cursor-default">
                ({event})
              </span>
            ))}
          </div>
          <p className="text-sm md:text-xl font-medium text-white/70 italic tracking-[0.1em] mt-2">
            The Ultimate Cinematic College Fest Experience
          </p>
        </div>
      </div>

     
    </div>
  )
}

export default Home