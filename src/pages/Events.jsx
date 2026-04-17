import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import MobileCard from '../components/MobileCard';

const Events = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const allCards = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // Calculate card positions based on current index
  const getCardPosition = (cardIndex, centerIndex) => {
    const offset = (cardIndex - centerIndex + allCards.length) % allCards.length;
    
    // Define positions for cards relative to center
    const positions = {
      0: { x: 0, scale: 1, opacity: 1, zIndex: 20 },           // Center
      1: { x: 200, scale: 0.9, opacity: 1, zIndex: 15 },      // Right
      2: { x: 350, scale: 0.8, opacity: 0.9, zIndex: 10 },    // Far right
      3: { x: 450, scale: 0.7, opacity: 0.8, zIndex: 5 },     // Far far right
      4: { x: 520, scale: 0.65, opacity: 0.7, zIndex: 3 },    // Extra far right
      5: { x: 580, scale: 0.65, opacity: 0.6, zIndex: 1 },    // Extra far right
      11: { x: -200, scale: 0.9, opacity: 1, zIndex: 15 },     // Left
      10: { x: -350, scale: 0.8, opacity: 0.9, zIndex: 10 },   // Far left
      9: { x: -450, scale: 0.7, opacity: 0.8, zIndex: 5 },     // Far far left
      8: { x: -520, scale: 0.65, opacity: 0.7, zIndex: 3 },    // Extra far left
      7: { x: -580, scale: 0.65, opacity: 0.6, zIndex: 1 },    // Extra far left
      6: { x: -620, scale: 0.6, opacity: 0.5, zIndex: 1 }      // Extra far left
    };
    
    return positions[offset] || { x: -700, scale: 0.6, opacity: 0, zIndex: 1 };
  };

  // Auto-rotate cards automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % allCards.length);
    }, 3000); // Change card every 3 seconds

    return () => clearInterval(interval);
  }, [allCards.length]);

  // Handle card click to bring it to center
  const handleCardClick = (cardIndex) => {
    setCurrentCardIndex(cardIndex);
  };
  
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setSwipeOffset(0);
  };
  
  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setSwipeOffset(offset);
  };
  
  const handleTouchEnd = (e) => {
    if (!isSwiping) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;
    
    setIsSwiping(false);
    
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // Swipe left - next card
        setCurrentCardIndex((prev) => (prev + 1) % allCards.length);
      } else {
        // Swipe right - previous card
        setCurrentCardIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
      }
    }
    setSwipeOffset(0);
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center" 
      style={{ 
        background: 'linear-gradient(180deg, #05070D, #0A0F1C)', 
        transform: `translateX(${swipeOffset}px)`
      }} 
      onTouchStart={handleTouchStart} 
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Cards Container */}
      <div className="relative flex items-center justify-center gap-8 md:gap-16">
        {/* Mobile Version - Only 3 Cards */}
        <div className="md:hidden relative z-20 transition-all duration-300 ease-in-out transform">
          {allCards.map((cardIndex) => {
            const offset = (cardIndex - currentCardIndex + allCards.length) % allCards.length;
            
            // Only show center card and immediate neighbors
            if (offset > 1 && offset < allCards.length - 1) return null;
            
            // Mobile positions for 3 cards only
            let mobilePosition;
            if (offset === 0) {
              // Center card
              mobilePosition = { x: 0, scale: 1, opacity: 1, zIndex: 20 };
            } else if (offset === 1) {
              // Right card
              mobilePosition = { x: 99, scale: 0.8, opacity: 0.9, zIndex: 15 };
            } else if (offset === allCards.length - 1) {
              // Left card (when offset wraps around)
              mobilePosition = { x: -99, scale: 0.8, opacity: 0.9, zIndex: 15 };
            } else {
              return null; // Hide any other cards
            }
            
            return (
              <div
                key={cardIndex}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${mobilePosition.x}px) scale(${mobilePosition.scale})`,
                  opacity: mobilePosition.opacity,
                  zIndex: mobilePosition.zIndex,
                }}
                onClick={() => handleCardClick(cardIndex)}
              >
                <MobileCard isVisible={true} selectedIndex={cardIndex} shouldSpin={false} setShouldSpin={() => {}} />
              </div>
            );
          })}
        </div>
        
        {/* Desktop Version - Moving Cards */}
        <div className="hidden md:block relative w-full h-96">
          {allCards.map((cardIndex) => {
            const position = getCardPosition(cardIndex, currentCardIndex);
            return (
              <div
                key={cardIndex}
                className="absolute top-1/2 left-1/2 transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${position.x}px) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                onClick={() => handleCardClick(cardIndex)}
              >
                <Card 
                  isVisible={true} 
                  selectedIndex={cardIndex} 
                  shouldSpin={false} 
                  setShouldSpin={() => {}} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Events;