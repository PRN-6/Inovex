import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MobileCard = ({ isVisible, selectedIndex, shouldSpin, setShouldSpin }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedIndex || 0);
  const mobileCardRef = useRef(null);

  useEffect(() => {
    if (!shouldSpin) {
      setCurrentImageIndex(selectedIndex || 0);
    }
  }, [selectedIndex, shouldSpin]);

  // Unified GSAP Spinning Animation
  useEffect(() => {
    if (shouldSpin && mobileCardRef.current) {
      const ctx = gsap.context(() => {
        gsap.to(mobileCardRef.current, {
          rotationY: 720, // Two full spins
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function() {
            // Smoothly change images during the spin
            if (this.progress() > 0.4 && this.progress() < 0.6) {
              setCurrentImageIndex(selectedIndex || 0);
            }
          },
          onComplete: () => {
            gsap.set(mobileCardRef.current, { rotationY: 0 });
            setShouldSpin(false);
          }
        });
      });
      return () => ctx.revert();
    }
  }, [shouldSpin, selectedIndex, setShouldSpin]);

  // Standardized GSAP Tilt Logic
  const handleMouseMove = (e) => {
    if (!mobileCardRef.current) return;
    
    const rect = mobileCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;
    
    gsap.to(mobileCardRef.current, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!mobileCardRef.current) return;
    
    gsap.to(mobileCardRef.current, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  if (!isVisible) return null;

  return (
    <div
      ref={mobileCardRef}
      className="md:hidden relative w-56 cursor-pointer"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white rounded-2xl shadow-2xl h-80 relative overflow-hidden pointer-events-none">
        <img 
          src={`/images/cards/card${currentImageIndex + 1}.png`} 
          alt="Event card" 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
      </div>
    </div>
  );
};

export default MobileCard;
