import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Play, ChevronLeft, ChevronRight, Share2, Plus, Info } from 'lucide-react';

const mediaData = [
  { id: 1, type: 'Event Highlight', date: '2026-03-12', title: 'INOVEX: The Grand Opening [Night at the Museum]', image: '/images/cards/card1.png', videoUrl: '/videos/media1.webm' },
  { id: 2, type: 'Guest Showcase', date: '2026-03-13', title: 'Cyber Realm: Electro Performance by SynthWave', image: '/images/cards/card2.png', videoUrl: '/videos/media2.webm' },
  { id: 3, type: 'Tech Expo', date: '2026-03-14', title: 'Digital Pulse: Future of AI Panel Discussion', image: '/images/cards/card3.png', videoUrl: '/videos/media1.webm' },
  { id: 4, type: 'Gaming Arena', date: '2026-03-15', title: 'Apex Warriors: Pro Gaming League Finals', image: '/images/cards/card4.png', videoUrl: '/videos/media1.webm' },
];

const Media = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const bgRef = useRef(null);
  const infoRef = useRef(null);
  const currentItem = mediaData[activeIndex];

  const handleNav = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (activeIndex + 1) % mediaData.length;
    } else {
      nextIndex = (activeIndex - 1 + mediaData.length) % mediaData.length;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        setIsAnimating(false);
      }
    });

    tl.to([bgRef.current, infoRef.current], {
      opacity: 0,
      x: direction === 'next' ? -50 : 50,
      duration: 0.4,
      ease: 'power2.in'
    });

    tl.fromTo([bgRef.current, infoRef.current],
      { opacity: 0, x: direction === 'next' ? 50 : -50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );
  };

  const jumpToMedia = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index);
        setIsAnimating(false);
      }
    });

    tl.to(infoRef.current, { opacity: 0, y: 20, duration: 0.3 });
    tl.to(bgRef.current, { opacity: 0, duration: 0.3 }, "<");
    tl.to(bgRef.current, { opacity: 1, duration: 0.5 });
    tl.to(infoRef.current, { opacity: 1, y: 0, duration: 0.5 }, "<");
  };

  return (
    <div id="media" className="h-screen w-screen bg-black text-white overflow-hidden relative font-['Inter',sans-serif]">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          key={currentItem.videoUrl}
          ref={bgRef}
          src={currentItem.videoUrl}
          poster={currentItem.image}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000 scale-100 md:scale-105"
        />
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20"></div>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
      </div>

      {/* Top Left: Title only */}
      <div className="absolute top-6 md:top-10 left-8 md:left-32 lg:left-40 z-20">
        <h1 className="text-xl md:text-3xl font-black tracking-[0.2em] uppercase leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Media
        </h1>
        <div className="h-0.5 w-full bg-white/20 mt-1"></div>
      </div>

      {/* Main Info Block (Bottom Left) */}
      <div ref={infoRef} className="absolute bottom-[25%] md:bottom-[10%] left-8 md:left-32 lg:left-40 z-20 max-w-2xl pr-8 md:pr-0">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-sm text-gray-300">
            {currentItem.type}
          </span>
          <span className="text-yellow-400 font-mono text-xs md:text-sm font-bold">
            {currentItem.date}
          </span>
        </div>

        <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4 md:mb-8 drop-shadow-2xl text-white">
          {currentItem.title}
        </h2>

        {/* Progress Line */}
        <div className="relative w-full h-[1.5px] md:h-[2px] bg-white/10 mb-6 md:mb-8 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-700 ease-out"
            style={{ width: `${((activeIndex + 1) / mediaData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Thumbnail Slider (Bottom Right) */}
      <div className="absolute bottom-[5%] md:bottom-[8%] right-0 z-20 w-full md:w-[45%] flex flex-col items-end gap-3 md:gap-6 overflow-hidden pr-4 md:pr-4 lg:pr-10">
        <div className="flex items-center gap-4 text-[10px] md:text-xs font-black tracking-widest uppercase mb-1 md:mb-0">
          <span className="text-yellow-400">{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/20">/</span>
          <span className="text-white/60">{String(mediaData.length).padStart(3, '0')}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4 w-full justify-end">
          <button onClick={() => handleNav('prev')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90">
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2 md:gap-4 overflow-hidden py-1 px-1">
            {mediaData.map((item, index) => (
              <div
                key={item.id}
                onClick={() => jumpToMedia(index)}
                className={`relative flex-shrink-0 cursor-pointer h-16 md:h-32 transition-all duration-300 ${index === activeIndex
                    ? 'w-32 md:w-64 border-b-2 md:border-b-4 border-yellow-400 opacity-100'
                    : 'w-20 md:w-40 opacity-40 hover:opacity-100'
                  }`}
              >
                <img src={item.image} alt="" className="w-full h-full object-cover rounded-sm" />
              </div>
            ))}
          </div>

          <button onClick={() => handleNav('next')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-90">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Media;
