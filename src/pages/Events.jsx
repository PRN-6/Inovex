import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Card from '../components/Card';

const Events = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [shouldSpin, setShouldSpin] = useState(false);
  
  const desktopRectangleRef = useRef(null);
  const mobileRectangleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Trigger animation when scrolled to Events section
      if (scrollPosition >= windowHeight * 0.5 && !hasAnimated) {
        setHasAnimated(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasAnimated]);

  // GSAP Popup Animation - triggered on scroll
  useEffect(() => {
    // Initial state - set rectangles to be invisible and scaled down
    gsap.set(desktopRectangleRef.current, {
      scale: 0,
      opacity: 0,
      rotation: -180
    });
    
    gsap.set(mobileRectangleRef.current, {
      scale: 0,
      opacity: 0,
      rotation: -180
    });

    // Function to trigger animations
    const triggerAnimations = () => {
      // Animate desktop rectangle
      gsap.to(desktopRectangleRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.1
      });

      // Animate mobile rectangle with slight delay
      gsap.to(mobileRectangleRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.2
      });

      // Animate circles inside rectangles
      const circles = desktopRectangleRef.current?.querySelectorAll('div > div > div') || [];
      const mobileCircles = mobileRectangleRef.current?.querySelectorAll('div > div > div') || [];
      
      gsap.fromTo([...circles, ...mobileCircles], 
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "elastic.out(1, 0.5)",
          delay: 0.4
        }
      );
    };

    // Check if already scrolled to Events section on mount
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    if (scrollPosition >= windowHeight * 0.5) {
      triggerAnimations();
    }
  }, []);

  // Trigger animation when scrolled to Events section
  useEffect(() => {
    if (hasAnimated) {
      // Animate desktop rectangle
      gsap.to(desktopRectangleRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.1
      });

      // Animate mobile rectangle with slight delay
      gsap.to(mobileRectangleRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.2
      });

      // Animate circles inside rectangles
      const circles = desktopRectangleRef.current?.querySelectorAll('div > div > div') || [];
      const mobileCircles = mobileRectangleRef.current?.querySelectorAll('div > div > div') || [];
      
      gsap.fromTo([...circles, ...mobileCircles], 
        {
          scale: 0,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "elastic.out(1, 0.5)",
          delay: 0.4
        }
      );
    }
  }, [hasAnimated]);

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(180deg, #05070D, #0A0F1C)' }}>
      {/* Background INOVEX Text */}
      <div className="absolute inset-0 flex items-center justify-center md:pr-20 md:justify-end overflow-hidden">
        <h1 className="text-[15rem] font-black text-white/5 tracking-tighter uppercase select-none">
          INOVEX
        </h1>
      </div>

      {/* Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/10 rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-white/5 rotate-12"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border border-white/10 rotate-45"></div>
      </div>

      
      {/* Desktop Rectangle - hidden on mobile */}
      <div ref={desktopRectangleRef} className="hidden md:block absolute top-1/2 left-80 transform -translate-y-1/2 w-25 h-110 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col gap-4">
            <div 
              className={`size-18 ${selectedCircle === 0 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 0) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(0);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 0 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>LOGO</span>
              </div>
            </div>
            <div 
              className={`size-18 ${selectedCircle === 1 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 1) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(1);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 1 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>LOGO</span>
              </div>
            </div>
            <div 
              className={`size-18 ${selectedCircle === 2 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 2) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(2);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 2 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>LOGO</span>
              </div>
            </div>
            <div 
              className={`size-18 ${selectedCircle === 3 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 3) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(3);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 3 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>LOGO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Rectangle - horizontal at the bottom - mobile only */}
      <div ref={mobileRectangleRef} className="md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-20 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg">
        <div className="flex items-center justify-center h-full">
          <div className="flex gap-4">
            <div 
              className={`size-12 ${selectedCircle === 0 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 0) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(0);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 0 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>L</span>
              </div>
            </div>
            <div 
              className={`size-12 ${selectedCircle === 1 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 1) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(1);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 1 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>L</span>
              </div>
            </div>
            <div 
              className={`size-12 ${selectedCircle === 2 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 2) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(2);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 2 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>L</span>
              </div>
            </div>
            <div 
              className={`size-12 ${selectedCircle === 3 ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
              onClick={() => {
                if (selectedCircle === 3) {
                  setSelectedCircle(null);
                  setCardVisible(false);
                } else {
                  if (cardVisible && selectedCircle !== null) {
                    setShouldSpin(true);
                  }
                  setSelectedCircle(3);
                  setCardVisible(true);
                }
              }}
            >
              <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                <span className={`${selectedCircle === 3 ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>L</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Card - changes content based on selected circle */}
      <Card isVisible={cardVisible} selectedIndex={selectedCircle} shouldSpin={shouldSpin} setShouldSpin={setShouldSpin} />
    </div>
  );
};

export default Events;
