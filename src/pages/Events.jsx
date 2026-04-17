import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Card from '../components/Card';

const Events = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [shouldSpin, setShouldSpin] = useState(false);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  
  // Define groups of 4 circles (separate pages)
  const circleGroups = [
    // Page 0: circles 0, 1, 2, 3
    [0, 1, 2, 3],
    // Page 1: circles 4, 5, 6, 7
    [4, 5, 6, 7],
    // Page 2: circles 8, 9, 10, 11
    [8, 9, 10, 11]
  ];
  
  // Define all events for individual access
  const allEvents = [
    { id: 0, label: '0' },
    { id: 1, label: '1' },
    { id: 2, label: '2' },
    { id: 3, label: '3' },
    { id: 4, label: '4' },
    { id: 5, label: '5' },
    { id: 6, label: '6' },
    { id: 7, label: '7' },
    { id: 8, label: '8' },
    { id: 9, label: '9' },
    { id: 10, label: '10' },
    { id: 11, label: '11' }
  ];
  
  const desktopRectangleRef = useRef(null);
  const mobileRectangleRef = useRef(null);

  // Navigation functions
  const goToNextGroup = () => {
    if (currentGroupIndex < circleGroups.length - 1) {
      // Animate current circles sliding up (0 disappears, 1,2,3 move up)
      const circles = document.querySelectorAll('.desktop-rect .size-18, .mobile-rect .size-12');
      if (circles.length > 0) {
        // Create timeline for smooth overlapping animations
        const tl = gsap.timeline();
        
        // Circle 0 disappears
        tl.to(circles[0], {
          y: -80,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0);
        
        // Circles 1,2,3 move up
        tl.to([circles[1], circles[2], circles[3]], {
          y: -40,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0);
        
        // Update state and prepare new circles
        tl.call(() => {
          setCurrentGroupIndex(currentGroupIndex + 1);
          setSelectedCircle(null);
          setCardVisible(false);
        }, null, 0.2);
        
        // Animate new circles without delay
        tl.add(() => {
          const newCircles = document.querySelectorAll('.desktop-rect .size-18, .mobile-rect .size-12');
          if (newCircles.length > 0) {
            // Set initial positions for new circles
            gsap.set(newCircles[0], { y: -40 });
            gsap.set(newCircles[1], { y: -40 });
            gsap.set(newCircles[2], { y: -40 });
            gsap.set(newCircles[3], { y: 40, opacity: 0 });
            
            // Circles 1,2,3 settle to final position
            gsap.to([newCircles[0], newCircles[1], newCircles[2]], {
              y: 0,
              duration: 0.5,
              ease: "power3.out"
            });
            
            // Circle 4 slides in
            gsap.to(newCircles[3], {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out"
            });
          }
        }, 0.2);
      }
    }
  };

  const goToPrevGroup = () => {
    if (currentGroupIndex > 0) {
      // Animate current circles sliding down (3 disappears, 0,1,2 move down)
      const circles = document.querySelectorAll('.desktop-rect .size-18, .mobile-rect .size-12');
      if (circles.length > 0) {
        // Create timeline for smooth overlapping animations
        const tl = gsap.timeline();
        
        // Circle 3 disappears
        tl.to(circles[3], {
          y: 80,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0);
        
        // Circles 0,1,2 move down
        tl.to([circles[0], circles[1], circles[2]], {
          y: 40,
          duration: 0.4,
          ease: "power3.inOut"
        }, 0);
        
        // Update state and prepare new circles
        tl.call(() => {
          setCurrentGroupIndex(currentGroupIndex - 1);
          setSelectedCircle(null);
          setCardVisible(false);
        }, null, 0.2);
        
        // Animate new circles without delay
        tl.add(() => {
          const newCircles = document.querySelectorAll('.desktop-rect .size-18, .mobile-rect .size-12');
          if (newCircles.length > 0) {
            // Set initial positions for new circles
            gsap.set(newCircles[0], { y: -40, opacity: 0 });
            gsap.set(newCircles[1], { y: 40 });
            gsap.set(newCircles[2], { y: 40 });
            gsap.set(newCircles[3], { y: 40 });
            
            // Circle 0 slides in
            gsap.to(newCircles[0], {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: "power3.out"
            });
            
            // Circles 1,2,3 settle to final position
            gsap.to([newCircles[1], newCircles[2], newCircles[3]], {
              y: 0,
              duration: 0.5,
              ease: "power3.out"
            });
          }
        }, 0.2);
      }
    }
  };

  // Handle circle click with page-aware indexing
  const handleCircleClick = (circleId) => {
    if (selectedCircle === circleId) {
      setSelectedCircle(null);
      setCardVisible(false);
    } else {
      if (cardVisible && selectedCircle !== null) {
        setShouldSpin(true);
      }
      setSelectedCircle(circleId);
      setCardVisible(true);
    }
  };

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
      <div ref={desktopRectangleRef} className="desktop-rect hidden md:block absolute top-1/2 left-80 transform -translate-y-1/2 w-25 h-110 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          {/* Top Arrow */}
          <button
            onClick={goToPrevGroup}
            disabled={currentGroupIndex === 0}
            className={`p-2 rounded-full transition-colors ${
              currentGroupIndex === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          {/* Current Group of 4 Circles */}
          <div className="flex flex-col gap-4">
            {circleGroups[currentGroupIndex].map((circleId) => (
              <div 
                key={circleId}
                className={`size-18 ${selectedCircle === circleId ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
                onClick={() => handleCircleClick(circleId)}
              >
                <div className="size-14 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className={`${selectedCircle === circleId ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>{allEvents[circleId].label}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Arrow */}
          <button
            onClick={goToNextGroup}
            disabled={currentGroupIndex === circleGroups.length - 1}
            className={`p-2 rounded-full transition-colors ${
              currentGroupIndex === circleGroups.length - 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Rectangle - horizontal at the bottom - mobile only */}
      <div ref={mobileRectangleRef} className="mobile-rect md:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-20 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg">
        <div className="flex items-center justify-center h-full gap-2">
          {/* Left Arrow */}
          <button
            onClick={goToPrevGroup}
            disabled={currentGroupIndex === 0}
            className={`p-1 rounded-full transition-colors ${
              currentGroupIndex === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Current Group of 4 Circles */}
          <div className="flex gap-2">
            {circleGroups[currentGroupIndex].map((circleId) => (
              <div 
                key={circleId}
                className={`size-12 ${selectedCircle === circleId ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'} rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 border-2`}
                onClick={() => handleCircleClick(circleId)}
              >
                <div className="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className={`${selectedCircle === circleId ? 'text-red-500' : 'text-gray-600'} font-bold text-xs`}>L</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Arrow */}
          <button
            onClick={goToNextGroup}
            disabled={currentGroupIndex === circleGroups.length - 1}
            className={`p-1 rounded-full transition-colors ${
              currentGroupIndex === circleGroups.length - 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Single Card - changes content based on selected circle */}
      <Card isVisible={cardVisible} selectedIndex={selectedCircle} shouldSpin={shouldSpin} setShouldSpin={setShouldSpin} />
    </div>
  );
};

export default Events;
