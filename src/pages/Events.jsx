import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import MobileCard from '../components/MobileCard';
import EventModal from '../components/EventModal';
import { eventsData } from '../data/eventsData';

const allCards = [0, 1, 2, 3, 4, 5, 6, 7];

const Events = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate card positions based on current index
  const getCardPosition = (cardIndex, centerIndex) => {
    const offset = (cardIndex - centerIndex + allCards.length) % allCards.length;

    // Define positions for cards relative to center
    const positions = {
      0: { x: 0, scale: 1, opacity: 1, zIndex: 20 }, // Center
      1: { x: 200, scale: 0.9, opacity: 1, zIndex: 15 }, // Right
      2: { x: 350, scale: 0.8, opacity: 0.9, zIndex: 10 }, // Far right
      3: { x: 460, scale: 0.7, opacity: 0.7, zIndex: 5 }, // Extra far right
      7: { x: -200, scale: 0.9, opacity: 1, zIndex: 15 }, // Left
      6: { x: -350, scale: 0.8, opacity: 0.9, zIndex: 10 }, // Far left
      5: { x: -460, scale: 0.7, opacity: 0.7, zIndex: 5 }, // Extra far left
      4: { x: -580, scale: 0.6, opacity: 0.5, zIndex: 1 }  // Hidden
    };

    return positions[offset] || { x: -700, scale: 0.6, opacity: 0, zIndex: 1 };
  };

  // Auto-rotate cards automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % allCards.length);
    }, 4000); // Increased interval slightly for better UX

    return () => clearInterval(interval);
  }, []);

  // Handle card click to open modal
  const handleCardClick = (cardIndex) => {
    if (cardIndex === currentCardIndex) {
      const eventId = cardIndex + 1;
      setSelectedEvent(eventsData[eventId]);
      setIsModalOpen(true);
    } else {
      setCurrentCardIndex(cardIndex);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
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
        setCurrentCardIndex((prev) => (prev + 1) % allCards.length);
      } else {
        setCurrentCardIndex((prev) => (prev - 1 + allCards.length) % allCards.length);
      }
    }
    setSwipeOffset(0);
  };

  return (
    <div
      id="events"
      className="min-h-screen relative flex items-center justify-center overflow-x-hidden overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #000000, #030303)',
        touchAction: 'pan-y'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background INOVEX Text */}
      <div className="absolute inset-0 flex items-center justify-center md:pr-20 md:justify-end overflow-hidden pointer-events-none">
        <h1 className="text-[15rem] font-black text-white/5 tracking-tighter uppercase select-none md:rotate-0 rotate-90">
          INOVEX
        </h1>
      </div>

      {/* Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/10 rotate-45"></div>
      </div>

      {/* Events Title */}
      <div className="absolute top-8 left-8 md:left-40 z-20">
        <h1 className="text-4xl md:text-5xl font-black text-yellow-400 tracking-normal uppercase">
          Events
        </h1>
      </div>

      {/* Cards Container */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Mobile Version */}
        <div className="md:hidden relative z-20 w-full h-96">
          {allCards.map((cardIndex) => {
            const offset = (cardIndex - currentCardIndex + allCards.length) % allCards.length;
            if (offset > 1 && offset < allCards.length - 1) return null;

            let mobileX = 0;
            if (offset === 1) mobileX = 70;
            else if (offset === allCards.length - 1) mobileX = -70;

            return (
              <div
                key={cardIndex}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${mobileX}px) scale(${offset === 0 ? 1 : 0.8})`,
                  opacity: offset === 0 ? 1 : 0.7,
                  zIndex: offset === 0 ? 20 : 15,
                }}
                onClick={() => handleCardClick(cardIndex)}
              >
                <MobileCard isVisible={true} selectedIndex={cardIndex} shouldSpin={false} setShouldSpin={() => { }} />
              </div>
            );
          })}
        </div>

        {/* Desktop Version */}
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
                <Card isVisible={true} selectedIndex={cardIndex} shouldSpin={false} setShouldSpin={() => { }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Selector dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-white/60 font-medium">Browse Events</p>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            {allCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCardIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentCardIndex ? 'bg-jurassic-red scale-150 shadow-[0_0_8px_#df1f26]' : 'bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Events;