import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const backgrounds = [
  '/images/heros/hero1.webp',
  '/images/heros/hero2.webp'
];

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);

  //Refs for GSAP animations
  const taglineRef = useRef(null);
  const redLineRef = useRef(null);
  const logoRef = useRef(null);
  const accentLineRef = useRef(null);
  const eventTagsRef = useRef(null);
  const footerTextRef = useRef(null);

  // GSAP animations for all text elements
  useEffect(() => {
    // Set initial states
    const ctx = gsap.context(() => {
      gsap.set(taglineRef.current, { y: 50, opacity: 0 });
      gsap.set(redLineRef.current, { width: 0, opacity: 0 });
      gsap.set(logoRef.current, { y: 100, opacity: 0, scale: 0.8 });
      gsap.set(accentLineRef.current, { width: 0, opacity: 0 });
      gsap.set(eventTagsRef.current, { y: 30, opacity: 0 });
      gsap.set(footerTextRef.current, { y: 30, opacity: 0 });

      // Create timeline
      const tl = gsap.timeline();

      // Animate elements in sequence
      tl.to(taglineRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .to(redLineRef.current, { width: "20%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(logoRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=0.3")
        .to(accentLineRef.current, { width: "50%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(eventTagsRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .to(footerTextRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  // Change background every 6 seconds with preloading
  useEffect(() => {
    // Preload next image function
    const preloadNextImage = (index) => {
      const nextIndex = (index + 1) % backgrounds.length;
      const img = new Image();
      img.src = backgrounds[nextIndex];
    };

    // Initial preload
    preloadNextImage(currentBg);

    const interval = setInterval(() => {
      setCurrentBg((prev) => {
        const next = (prev + 1) % backgrounds.length;
        preloadNextImage(next); // Preload the one after next
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [currentBg]); // Re-run when currentBg changes to ensure next is preloaded

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${backgrounds[currentBg]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top right',
        backgroundPositionX: '82%',
        transition: 'background-image 2s ease-in-out, opacity 2s ease-in-out'
      }}
    >
      {/* Cinematic dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/40 to-transparent pointer-events-none"></div>

      {/* Branding Container */}
      <div className="relative z-10 flex flex-col max-w-5xl md:mx-18">

        {/* Status Tag */}
        <div ref={taglineRef} className="hidden md:flex items-center gap-4 mb-6 md:mb-8 bg-black/40 backdrop-blur-md w-fit px-4 py-1 border-l-2 border-jurassic-yellow">
          <div className="w-2 h-2 rounded-full bg-jurassic-yellow shadow-[0_0_8px_#f9d423] animate-pulse"></div>
          <p className="text-[10px] md:text-sm font-black tracking-[0.4em] text-white/90 uppercase">
            // STATUS: LIVE // COLLEGE FEST 2026 : INOVEX
          </p>
        </div>

        {/* Accent Line */}
        <div ref={redLineRef} className="w-24 md:w-48 h-1 bg-jurassic-red mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 skew-x-[-45deg] animate-shimmer"></div>
        </div>

        {/* Logo */}
        <div ref={logoRef} className="mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <img
            src="/images/logo.svg"
            alt="INOVEX Logo"
            className="w-64 md:w-96 lg:w-lg h-auto object-contain"
          />
        </div>

        {/* Main Red Accent */}
        <div ref={accentLineRef} className="w-full md:w-100 h-3 md:h-5 bg-jurassic-red relative overflow-hidden mb-10 shadow-[0_0_20px_rgba(223,31,38,0.4)]">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-white/20 skew-x-[-45deg] animate-shimmer"></div>
        </div>

        {/* Event Tags */}
        <div ref={eventTagsRef} className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 md:gap-4">
            {['IT MANAGER', 'TREASURE HUNT', 'GAMING', 'PRODUCT LAUNCH', 'WEB DESIGN'].map((event) => (
              <span key={event} className="text-[10px] md:text-xs font-bold text-white/50 border border-white/20 px-3 py-1 tracking-widest hover:border-jurassic-yellow hover:text-white transition-colors cursor-default">
                ({event})
              </span>
            ))}
            <span className="text-[10px] md:text-xs font-bold text-white/50 border border-white/20 px-3 py-1 tracking-widest hover:border-jurassic-yellow hover:text-white transition-colors cursor-default">
              (HACKATHON)
            </span>
          </div>
          <p ref={footerTextRef} className="text-sm md:text-xl font-medium text-white/70 italic tracking-[0.1em] mt-2"></p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <span className="text-white/50 text-[10px] font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-4 h-8 border border-white/30 rounded-full flex justify-center">
            <div className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5 animate-scroll"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
