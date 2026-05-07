import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useSearchParams } from 'react-router-dom'

const backgrounds = [
  // '/images/heros/hero1.webp',
  // '/images/heros/hero2.webp',
  '/images/heros/hero3.webp',
  '/images/heros/hero4.webp'
];

const Hero = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  //Refs for GSAP animations
  const taglineRef = useRef(null);
  const redLineRef = useRef(null);
  const logoRef = useRef(null);
  const accentLineRef = useRef(null);

  // GSAP animations for all text elements
  useEffect(() => {
    // Set initial states
    const ctx = gsap.context(() => {
      gsap.set(taglineRef.current, { y: 50, opacity: 0 });
      gsap.set(redLineRef.current, { width: 0, opacity: 0 });
      gsap.set(logoRef.current, { y: 100, opacity: 0, scale: 0.8 });
      gsap.set(accentLineRef.current, { width: 0, opacity: 0 });

      // Create timeline
      const tl = gsap.timeline();

      // Animate elements in sequence
      tl.to(taglineRef.current, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .to(redLineRef.current, { width: "20%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to(logoRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.7)" }, "-=0.3")
        .to(accentLineRef.current, { width: "50%", opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.5");
    });

    return () => ctx.revert();
  }, []);

  const handleDeptClick = (type) => {
    setSearchParams({ type });
    setTimeout(() => {
      const element = document.getElementById('events');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

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
      className={`relative min-h-screen w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 overflow-hidden bg-black transition-all duration-[2000ms] ease-in-out ${backgrounds[currentBg].includes('hero3')
        ? 'bg-center md:bg-[82%_top]'
        : backgrounds[currentBg].includes('hero4')
          ? 'bg-[75%_top] md:bg-[82%_top]'
          : 'bg-[82%_top]'
        }`}
      style={{
        backgroundImage: `url(${backgrounds[currentBg]})`,
        backgroundSize: 'cover'
      }}
    >
      {/* Cinematic dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/40 to-transparent pointer-events-none"></div>

      {/* College Logo - Top Left */}
      <a
        href="https://www.ajiet.edu.in"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 left-10 md:top-5 md:left-28 lg:left-48 z-30 drop-shadow-2xl block"
      >
        <img
          src="/images/college-logo.webp"
          alt="College Logo"
          className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Placeholder if image isn't available yet */}
        <div className="hidden items-center justify-center px-4 py-2 border border-white/10 bg-black/40 backdrop-blur-md rounded-lg text-xs font-bold tracking-widest text-white/50 uppercase">
          College Logo
        </div>
      </a>

      {/* Main Content Layout - Split on Desktop */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">

        {/* Left Side: Branding & Departments */}
        <div className="flex flex-col max-w-5xl md:mx-18">

          {/* Status Tag */}
          {/* <div ref={taglineRef} className="hidden md:flex items-center gap-4 mb-6 md:mb-8 bg-black/40 backdrop-blur-md w-fit px-4 py-1 border-l-2 border-jurassic-yellow">
          <div className="w-2 h-2 rounded-full bg-jurassic-yellow shadow-[0_0_8px_#f9d423] animate-pulse"></div>
          <p className="text-[10px] md:text-sm font-black tracking-[0.4em] text-white/90 uppercase">
            // STATUS: LIVE // COLLEGE FEST 2026
          </p>
        </div> */}

          {/* Accent Line */}
          <div ref={redLineRef} className="w-24 md:w-48 h-1 bg-jurassic-red mt-1 mb-1 relative overflow-hidden will-change-[width]">
            <div className="absolute inset-0 bg-white/40 skew-x-[-45deg] animate-shimmer"></div>
          </div>

          {/* Department & Action Section */}
          <div className="flex flex-col gap-0 mb-4 z-20">

            {/* Logos Row */}
            <div className="flex flex-row items-center gap-1 md:gap-2">
              {/* MCA Logo */}
              <div className="relative w-36 h-36 md:w-56 md:h-56 transition-all duration-500 flex items-center justify-center group">
                <img
                  src="/images/logo.svg"
                  alt="MCA Logo"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />
              </div>

              {/* Collaboration X */}
              <div className="text-2xl md:text-4xl font-black text-white/20 select-none">X</div>

              {/* MBA Logo */}
              <div className="relative w-36 h-36 md:w-56 md:h-56 transition-all duration-500 flex items-center justify-center group">
                <img
                  src="/images/mba-logo.svg"
                  alt="MBA Logo"
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                />
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-row flex-wrap gap-3 md:gap-4">
              <button
                onClick={() => handleDeptClick('technical')}
                className="px-6 py-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30 rounded-lg text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300"
              >
                TECHNICAL
              </button>
              <button
                onClick={() => handleDeptClick('cultural')}
                className="px-6 py-2.5 bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-600/30 rounded-lg text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300"
              >
                CULTURAL
              </button>
              <button
                onClick={() => handleDeptClick('management')}
                className="px-6 py-2.5 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-600/30 rounded-lg text-[10px] md:text-xs font-black tracking-[0.2em] uppercase transition-all duration-300"
              >
                MANAGEMENT
              </button>
            </div>
          </div>

          {/* Main Red Accent */}
          <div ref={accentLineRef} className="w-full md:w-100 h-3 md:h-5 bg-jurassic-red relative overflow-hidden mb-10 shadow-[0_0_20px_rgba(223,31,38,0.4)]">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-white/20 skew-x-[-45deg] animate-shimmer"></div>
          </div>
        </div>

        {/* Right Side: Primary Logo */}
        <div ref={logoRef} className="mb-8 md:mb-0 md:-mt-48 md:mr-32 lg:mr-48 flex items-center justify-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] will-change-transform will-change-opacity order-first md:order-last">
          <img
            src="/images/astrix.svg"
            alt="INOVEX Logo"
            className="w-36 md:w-56 lg:w-72 xl:w-96 h-auto object-contain"
          />
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
