import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mediaData } from '../data/mediaData';

const Media = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const bgRef = useRef(null);
  const infoRef = useRef(null);
  const currentItem = mediaData[activeIndex];

  // Carousel Indices
  const prevIndex = (activeIndex - 1 + mediaData.length) % mediaData.length;
  const nextIndex = (activeIndex + 1) % mediaData.length;

  const handleNav = (direction) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const targetIndex = direction === 'next' ? nextIndex : prevIndex;

    gsap.to([bgRef.current, infoRef.current], {
      opacity: 0,
      x: direction === 'next' ? -50 : 50,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(targetIndex);
        setTimeout(() => {
          gsap.fromTo([bgRef.current, infoRef.current],
            { opacity: 0, x: direction === 'next' ? 50 : -50 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', onComplete: () => setIsAnimating(false) }
          );
        }, 50);
      }
    });
  };

  return (
    <div id="media" className="h-screen w-screen bg-black text-white overflow-hidden relative font-['Inter',sans-serif] md:pl-16">
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

      {/* Top Left: Title */}
      <div className="absolute top-6 md:top-10 left-8 md:left-32 lg:left-40 z-20">
        <h1 className="text-xl md:text-3xl font-black tracking-[0.2em] uppercase leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Media
        </h1>
        <div className="h-0.5 w-full bg-white/20 mt-1"></div>
      </div>

      {/* Main Info Block (Middle Left) */}
      <div ref={infoRef} className="absolute top-[40%] md:top-[30%] left-8 md:left-32 lg:left-40 z-20 max-w-2xl pr-8 md:pr-0">
        <div className="flex items-center gap-3 mb-2 md:mb-4">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-sm text-gray-300">
            {currentItem.type}
          </span>
          <span className="text-yellow-400 font-mono text-xs md:text-sm font-bold">
            {currentItem.date}
          </span>
        </div>

        <h2 className="text-3xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] mb-4 md:mb-8 drop-shadow-2xl text-white">
          {currentItem.title}
        </h2>

        {/* Cinematic Underline */}
        <div className="w-24 md:w-48 h-1 bg-yellow-400 opacity-60"></div>
      </div>

      {/* Focused Carousel (Bottom Section) */}
      <div className="absolute bottom-3 md:bottom-6 right-0 left-0 md:left-auto md:right-10 lg:right-20 z-30 flex flex-col items-center md:items-end gap-6 px-4">
        
        {/* Indicators and Navigation */}
        <div className="flex items-center justify-center gap-4 md:gap-1 relative">
          
          {/* PREV ITEM */}
          <div 
            onClick={() => handleNav('prev')}
            className="hidden md:flex flex-col items-end opacity-30 scale-75 transition-all duration-500 origin-right cursor-pointer hover:opacity-50"
          >
            <div className="w-32 h-16 overflow-hidden rounded-sm border border-white/10 relative shadow-2xl">
              <img src={mediaData[prevIndex].image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[7px] font-bold tracking-widest text-white/50 uppercase">
              <span>{String(prevIndex + 1).padStart(2, '0')} / {String(mediaData.length).padStart(3, '0')}</span>
              <span className="text-yellow-400/40">LAST</span>
            </div>
          </div>

          {/* PREV BUTTON */}
          <button 
            onClick={() => handleNav('prev')}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center z-40 -mr-4 md:-mr-5 shadow-xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>

          {/* ACTIVE ITEM */}
          <div className="relative group">
            <div className="w-[65vw] md:w-[320px] lg:w-[380px] h-32 md:h-44 lg:h-52 overflow-hidden rounded-md border-2 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-all duration-500">
              <img src={currentItem.image} className="w-full h-full object-cover" alt="" />
              
              {/* Image Overlay Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <p className="text-[10px] md:text-sm font-black uppercase tracking-tight text-white leading-tight">
                  {currentItem.title}
                </p>
                <div className="h-0.5 w-10 bg-yellow-400 mt-1.5 opacity-80"></div>
              </div>
            </div>
          </div>

          {/* NEXT BUTTON */}
          <button 
            onClick={() => handleNav('next')}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center z-40 -ml-4 md:-ml-5 shadow-xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>

          {/* NEXT ITEM */}
          <div 
            onClick={() => handleNav('next')}
            className="hidden md:flex flex-col items-start opacity-30 scale-75 transition-all duration-500 origin-left cursor-pointer hover:opacity-50"
          >
            <div className="w-32 h-16 overflow-hidden rounded-sm border border-white/10 relative shadow-2xl">
              <img src={mediaData[nextIndex].image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[7px] font-bold tracking-widest text-white/50 uppercase">
              <span className="text-yellow-400/40">NEXT</span>
              <span>{String(nextIndex + 1).padStart(2, '0')} / {String(mediaData.length).padStart(3, '0')}</span>
            </div>
          </div>

        </div>

        {/* Global Progress Bar */}
        <div className="w-full max-w-[200px] h-0.5 bg-white/10 relative hidden md:block">
          <div 
            className="absolute inset-y-0 left-0 bg-yellow-400 transition-all duration-500"
            style={{ width: `${((activeIndex + 1) / mediaData.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Media;


