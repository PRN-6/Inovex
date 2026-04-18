import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Card = ({ isVisible, selectedIndex, shouldSpin, setShouldSpin }) => {
  const mobileCardRef = useRef(null);
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(selectedIndex !== null ? selectedIndex : 0);

  // Update currentImageIndex when selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== null && !shouldSpin) {
      setCurrentImageIndex(selectedIndex);
    }
  }, [selectedIndex, shouldSpin]);

  // Handle tilt animation on hover
  const handleMouseMove = (e, cardElement) => {
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    gsap.to(cardElement, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (cardElement) => {
    if (!cardElement) return;
    
    gsap.to(cardElement, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  // Animate first card on scroll
  useEffect(() => {
    if (cardRef.current && selectedIndex === 0 && !hasAnimated) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (scrollPosition >= windowHeight * 0.5 && !hasAnimated) {
          setHasAnimated(true);
          
          gsap.fromTo(cardRef.current, 
            { x: 200, opacity: 0, rotationY: 45, scale: 0.8 },
            { x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1.0, ease: "power3.out" }
          );
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [selectedIndex, hasAnimated]);

  // Animate card when visibility changes
  useEffect(() => {
    if (cardRef.current && isVisible && !(selectedIndex === 0 && hasAnimated)) {
      gsap.fromTo(cardRef.current, 
        { x: 200, opacity: 0, rotationY: 45, scale: 0.8 },
        { x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1.0, ease: "power3.out" }
      );
    }
  }, [isVisible, selectedIndex, hasAnimated]);

  // Handle spinning animation
  useEffect(() => {
    if (shouldSpin && (mobileCardRef.current || cardRef.current)) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        if (mobileCardRef.current) {
          tl.to(mobileCardRef.current, {
            rotationY: 180,
            duration: 0.6,
            ease: "power1.inOut",
            onUpdate: function() {
              if (this.progress() > 0.45) setCurrentImageIndex(selectedIndex);
            }
          })
          .to(mobileCardRef.current, {
            rotationY: 360,
            duration: 0.6,
            ease: "power1.inOut",
            onComplete: () => gsap.set(mobileCardRef.current, { rotationY: 0 })
          });
        }
        
        if (cardRef.current) {
          tl.to(cardRef.current, {
            rotationY: 360,
            duration: 1.2,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(cardRef.current, { rotationY: 0 });
              setShouldSpin(false);
            }
          }, 0);
        }
      });
      return () => ctx.revert();
    }
  }, [shouldSpin, selectedIndex, setShouldSpin]);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Card */}
      <div
        ref={mobileCardRef}
        className="md:hidden relative w-64"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={(e) => handleMouseMove(e, mobileCardRef.current)}
        onMouseLeave={() => handleMouseLeave(mobileCardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-96 relative overflow-hidden">
          <img 
            src={`/images/cards/card${currentImageIndex + 1}.png`} 
            alt="Event card" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {/* Desktop Card */}
      <div
        ref={cardRef}
        className="hidden md:block relative w-96"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={(e) => handleMouseMove(e, cardRef.current)}
        onMouseLeave={() => handleMouseLeave(cardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-144 relative overflow-hidden">
          <img 
            src={`/images/cards/card${currentImageIndex + 1}.png`} 
            alt="Event card" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>
      </div>
    </>
  );
};

export default Card;
